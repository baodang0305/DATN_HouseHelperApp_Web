import React from "react";
import { Layout, Row, Col, Button, Input, Tooltip, Tabs, Menu } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import socketIoClient from "socket.io-client";
import { connect } from "react-redux";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import Messages from "../Messages/Messages";
import history from "../../../helpers/history";
import { indexConstants } from "../../../constants/index.constants";
import "./ChatContainer.css";

const { Search } = Input;
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

let socket;

class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            receiverActive: null,
            receiverRecent: null,
            usersActive: null,
            usersRecent: null,
            filteredUsersActive: null,
            filteredUsersRecent: null,
            familyGroup: null,
            message: "",
            messagesChatSingle: [],
            messagesChatGroup: [],
            userIsEnteringSingle: null,
            userIsEnteringGroup: null,
            activeTab: "active",
            searchInput: "",
            enpoint: indexConstants.ENPOINT_SOCKET
        }
    }

    componentDidMount() {

        const { enpoint } = this.state;
        const { user } = this.props;

        socket = socketIoClient(enpoint);

        socket.emit("join", user);

        socket.on("server-send-list-user-active", (usersActive) => {
            const { activeTab } = this.state;
            if (activeTab === "active") {
                if (usersActive.length !== 0) {
                    this.setState({
                        usersActive,
                        receiverActive: usersActive[0],
                        filteredUsersActive: usersActive
                    });

                    socket.emit("client-request-content-messages", { "receiver": usersActive[0], "sender": user });
                } else {
                    this.setState({ 
                        receiverActive: null,
                        messagesChatSingle: null,
                        filteredUsersActive: null
                    });
                }
            }
        });

        // socket.on("server-send-list-user-recent", (usersRecent) => {
        //     if (usersRecent.length !== 0) {
        //         this.setState({
        //             usersRecent,
        //             receiverRecent: usersRecent[0],
        //             filteredUsersRecent: usersRecent
        //         });
        //         socket.emit("client-request-content-messages", { "receiver": usersRecent[0], "sender": user });
        //     } else {
        //         this.setState({ messagesChatSingle: [] });
        //     }
        // });

        // socket.on("server-send-family-group", (familyGroup) => {
        //     if (familyGroup) {
        //         this.setState({
        //             familyGroup,
        //             messagesChatGroup: familyGroup.messages
        //         });
        //     } else {
        //         this.setState({ messagesChatGroup: [] });
        //     }
        // });

        socket.on("server-response-messages-chat-single", ({ user, messages }) => {
            const { activeTab, receiverRecent, receiverActive } = this.state;

            if (activeTab === "recent") {
                if (user.mEmail === receiverRecent.mEmail) {
                    this.setState({ messagesChatSingle: messages });
                }
            } else if (activeTab === "active") {
                if (user.mEmail === receiverActive.mEmail) {
                    this.setState({ messagesChatSingle: messages });
                }
            }

        });

        // socket.on("server-response-messages-chat-group", (messages) => {
        //     this.setState({ messagesChatGroup: messages });
        // });

        socket.on("server-response-user-is-entering-to-partner", (sender) => {
            const { activeTab, receiverActive, receiverRecent } = this.state;
            if (activeTab === "recent") {
                if (sender.mEmail === receiverRecent.mEmail) {
                    this.setState({ userIsEnteringSingle: sender });
                }
            } else if (activeTab === "active") {
                if (sender.mEmail === receiverActive.mEmail) {
                    this.setState({ userIsEnteringSingle: sender });
                }
            }
        });

        socket.on("server-response-user-is-stoped-entering-to-partner", (sender) => {
            const { activeTab, receiverActive, receiverRecent } = this.state;
            if (activeTab === "recent") {
                if (sender.mEmail === receiverRecent.mEmail) {
                    this.setState({ userIsEnteringSingle: null });
                }
            } else if (activeTab === "active") {
                if (sender.mEmail === receiverActive.mEmail) {
                    this.setState({ userIsEnteringSingle: null });
                }
            }
        });

        // socket.on("server-response-user-is-entering-to-group", (sender) => {
        //     this.setState({ userIsEnteringGroup: sender });
        // });

        // socket.on("server-response-user-is-stoped-entering-to-group", (sender) => {
        //     this.setState({ userIsEnteringGroup: null });
        // });
    }

    handleClickBack = () => {
        history.goBack();
    }

    handleClickMenuActive = (e) => {

        const { usersActive } = this.state;
        const { user } = this.props;

        const result = usersActive.find(userActive => userActive.mSocketID === e.key);
        socket.emit("client-request-content-messages", { "receiver": result, "sender": user });
        this.setState({ receiverActive: result });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleKeyPressMessage = (e) => {

        const { message, receiverActive, receiverRecent, activeTab } = this.state;
        const { user } = this.props;

        if (message) {
            if (e.key === "Enter") {
                if (activeTab === "active") {
                    socket.emit("client-send-message", { "receiver": receiverActive, "sender": user, message });
                } else if (activeTab === "recent") {
                    socket.emit("client-send-message", { "receiver": receiverRecent, "sender": user, message });
                } else {
                    socket.emit("client-send-message-to-chat-group", { "member": user, "message": message });
                }
                this.setState({ message: "" });
            }
        }
    }

    handleClickMenuRecent = (e) => {
        const { user } = this.props;
        const { usersRecent } = this.state;

        const result = usersRecent.find(userRecent => userRecent.mEmail === e.key);
        socket.emit("client-request-content-messages", { "receiver": result, "sender": user });
        this.setState({ receiverRecent: result });
    }

    handleTabClick = (key) => {

        const { user } = this.props;

        if (key === "active") {
            socket.emit("client-request-send-list-user-active",{ "mEmail": user.mEmail, "fID": user.fID });
        } else if (key === "recent") {
            socket.emit("client-request-send-list-user-recent", user.mEmail);
        } else {
            socket.emit("client-request-send-family-group", user.fID);
        }
        this.setState({ activeTab: key });
    }

    handleChangeSearchInput = (e) => {
        const { usersRecent, usersActive, activeTab } = this.state;
        const { user } = this.props;

        const { name, value } = e.target;

        if (activeTab === "recent") {
            const filteredUsersRecent = usersRecent.filter(element => {
                return element.mName.toLowerCase().includes(value.toLowerCase());
            });

            if (filteredUsersRecent.length !== 0) {
                this.setState({
                    filteredUsersRecent,
                    receiverRecent: filteredUsersRecent[0]
                });
                socket.emit("client-request-content-messages", { "receiver": filteredUsersRecent[0], "sender": user });
            } else {
                this.setState({
                    messagesChatSingle: null,
                    receiverRecent: null,
                    filteredUsersRecent: null
                });
            }
        } else {
            const filteredUsersActive = usersActive.filter(element => {
                return element.mName.toLowerCase().includes(value.toLowerCase());
            });
            let index = -1;
            for (let i = 0; i < filteredUsersActive.length; i++) {
                if (filteredUsersActive[i].mEmail !== user.mEmail) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.setState({
                    filteredUsersActive,
                    receiverActive: filteredUsersActive[index]
                });
                socket.emit("client-request-content-messages", { "receiver": filteredUsersActive[index], "sender": user });
            } else {
                this.setState({
                    messagesChatSingle: null,
                    receiverActive: null,
                    filteredUsersActive: null
                });
            }
        }
        this.setState({ [name]: value });
    }

    handleOnFocus = () => {

        const { user } = this.props;
        const { activeTab, receiverActive, receiverRecent, familyGroup } = this.state;
        if (activeTab === "active") {
            socket.emit("client-notification-is-entering", { "sender": user, "receiver": receiverActive });
        } else if (activeTab === "recent") {
            socket.emit("client-notification-is-entering", { "sender": user, "receiver": receiverRecent });
        } else {
            socket.emit("client-notification-is-entering", { "sender": user, "receiver": familyGroup });
        }
    }

    handleOnBlur = () => {

        const { user } = this.props;
        const { activeTab, receiverRecent, receiverActive, familyGroup } = this.state;

        if (activeTab === "active") {
            socket.emit("client-notification-is-stoped-entering", { "sender": user, "receiver": receiverActive });
        } else if (activeTab === "recent") {
            socket.emit("client-notification-is-stoped-entering", { "sender": user, "receiver": receiverRecent });
        } else {
            socket.emit("client-notification-is-stoped-entering", { "sender": user, "receiver": familyGroup });
        }
    }

    render() {

        const { filteredUsersActive, filteredUsersRecent, receiverActive, receiverRecent, userIsEnteringSingle,
            messagesChatSingle, messagesChatGroup, message, activeTab, searchInput, familyGroup, userIsEnteringGroup } = this.state;
        const { user } = this.props;

        const toolBar = () => (
            <Row className="tool-bar-container">
                <Col>
                    <i className="fa fa-camera fa-lg"></i> &ensp;
                    <i className="fa fa-microphone fa-lg" ></i> &ensp;
                    <i className="fa fa-image fa-lg"></i> &ensp;
                </Col>
                <Col flex="auto">
                    <Input
                        className="message-input"
                        placeholder="Type a message..."
                        suffix={
                            <Tooltip title="choose an emoji">
                                <i className="fa fa-smile-o fa-lg icon-smile"></i>
                            </Tooltip>
                        }
                        name="message"
                        value={message}
                        onChange={this.handleChange}
                        onFocus={this.handleOnFocus}
                        onBlur={this.handleOnBlur}
                        onPressEnter={this.handleKeyPressMessage}
                    />
                </Col>
            </Row>
        );

        const showToolBar = () => {
            if (activeTab === "active") {
                if (receiverActive) {
                    return toolBar();
                }
            } else if (activeTab === "recent") {
                if (receiverRecent) {
                    return toolBar();
                }
            } else {
                if (familyGroup) {
                    return toolBar();
                }
            }
        }

        const headerBodyMessage = () => {
            if (activeTab === "active") {
                if (receiverActive) {
                    return (
                        <>
                            <img className="img-header-message" src={receiverActive.mAvatar.image} style={{backgroundColor: receiverActive.mAvatar.color}}/> &emsp;
                            <span>
                                <div className="name-header-message">{receiverActive.mName}</div>
                                <div className="active-container">  <div className="circle-active" /> &nbsp; Active  </div>
                            </span>
                        </>
                    );
                }
            } else if (activeTab === "recent") {
                if (receiverRecent) {
                    return (
                        <>
                            <img className="img-header-message" src={receiverRecent.mAvatar.image} style={{ backgroundColor: receiverRecent.mAvatar.color}} /> &emsp;
                            <span>
                                <div className="name-header-message">{receiverRecent.mName}</div>
                                {receiverRecent.mSocketID && <div className="active-container">  <div className="circle-active" /> &nbsp; Active  </div>}
                            </span>
                        </>
                    );
                }
            } else {
                if (familyGroup) {
                    return (
                        <>
                            <img className="img-header-message" src={familyGroup.fImage} /> &emsp;
                            <div className="name-header-message">{familyGroup.fName}</div>
                        </>
                    );
                }
            }
        }

        const showMessages = () => {
            if (activeTab === "family-group") {
                if (familyGroup && messagesChatGroup) {
                    if (userIsEnteringGroup && userIsEnteringGroup.mEmail !== user.mEmail) {
                        return <Messages messages={messagesChatGroup} userIsEntering={userIsEnteringGroup} mName={user.mName} />
                    }
                    return <Messages messages={messagesChatGroup} mName={user.mName} />
                }
            } else if (activeTab === "active") {
                if (receiverActive && messagesChatSingle) {
                    if (userIsEnteringSingle && userIsEnteringSingle.mEmail === receiverActive.mEmail) {
                        return <Messages messages={messagesChatSingle} userIsEntering={userIsEnteringSingle} mName={user.mName} />
                    }
                    return <Messages messages={messagesChatSingle} mName={user.mName} />
                }
            } else {
                if (receiverRecent && messagesChatSingle) {
                    if (userIsEnteringSingle && userIsEnteringSingle.mEmail === receiverRecent.mEmail) {
                        return <Messages messages={messagesChatSingle} userIsEntering={userIsEnteringSingle} mName={user.mName} />
                    }
                    return <Messages messages={messagesChatSingle} mName={user.mName} />
                }
            }
        }

        return (
            <Layout style={{ minHeight: "100vh" }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="site-layout-background" >
                        <Row style={{ textAlign: "center" }}>
                            <Col style={{ marginLeft: "10px" }}>
                                <Button onClick={this.handleClickBack} size="large"> <LeftOutlined /> </Button>
                            </Col>
                            <Col flex="auto">
                                <div className="title-header">Message</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: 20 }}>
                        <Row className="chat-container">
                            <Col span={8} className="chat-list-container">
                                <Row className="header-chat-list-container">
                                    <img className="img-header-chat-list" src={user.mAvatar.image} style={{backgroundColor: user.mAvatar.color}} /> &emsp;
                                        <div className="name-header-chat-list">{user.mName}</div>
                                </Row>
                                <Row className="search-chat-list-container">
                                    <Search name="searchInput" value={searchInput} onChange={this.handleChangeSearchInput} className="search-chat-list" placeholder="search messenger" />
                                </Row>
                                <Row className="content-chat-list-container">
                                    <Tabs defaultActiveKey={activeTab} onTabClick={this.handleTabClick}>

                                        <TabPane tab="Active" key="active">
                                            {receiverActive &&
                                                <Menu style={{ borderRight: "none" }} selectedKeys={[receiverActive.mSocketID]} onClick={this.handleClickMenuActive}>
                                                    {filteredUsersActive.map((userActive) => {
                                                        return (
                                                            <Menu.Item className="menu-item-container" key={userActive.mSocketID}>
                                                                <Row className="item-chat-list-container">
                                                                    <img className="img-item-chat-list" src={userActive.mAvatar.image} style={{backgroundColor: userActive.mAvatar.color}} /> &emsp;
                                                                    <div className="name-item-chat-list">{userActive.mName}</div> &emsp; <div className="icon-active" />
                                                                </Row>
                                                            </Menu.Item>
                                                        )
                                                    })
                                                    }
                                                </Menu>
                                            }
                                        </TabPane>

                                        <TabPane tab="Recent" key="recent">
                                            {receiverRecent &&
                                                <Menu style={{ borderRight: "none" }} selectedKeys={[receiverRecent.mEmail]} onClick={this.handleClickMenuRecent}>
                                                    {filteredUsersRecent && filteredUsersRecent.map((userRecent) =>
                                                        <Menu.Item className="menu-item-container" key={userRecent.mEmail}>
                                                            <Row className="item-chat-list-container">
                                                                <img className="img-item-chat-list" src={userRecent.mAvatar.image} style={{backgroundColor: userRecent.mAvatar.color}}/> &emsp;
                                                                <div className="name-item-chat-list">{userRecent.mName}</div> &emsp;
                                                                {userRecent.mSocketID && <div className="icon-active" />}
                                                            </Row>
                                                        </Menu.Item>
                                                    )}
                                                </Menu>
                                            }
                                        </TabPane>

                                        <TabPane tab="Family Group" key="family-group">
                                            {familyGroup &&
                                                <Menu style={{ borderRight: "none" }} selectedKeys={["group"]}>
                                                    <Menu.Item className="menu-item-container" key="group">
                                                        <Row className="item-chat-list-container">
                                                            <img className="img-item-chat-list" src={familyGroup.fImage} /> &emsp;
                                                            <div className="name-item-chat-list"> {familyGroup.fName} </div>
                                                        </Row>
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                        </TabPane>
                                    </Tabs>
                                </Row>
                            </Col>
                            <Col span={16}>
                                <Row className="header-message-container">
                                    {headerBodyMessage()}
                                </Row>
                                <Row className="content-message-container">
                                    {showMessages()}
                                </Row>
                                {showToolBar()}
                            </Col>
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    const { inforLogin } = state.authentication;
    const { user } = inforLogin;
    return {
        user
    }
}

export default connect(mapStateToProps)(ChatContainer);