import React from "react";
import { Layout, Row, Col, Button, Input, Tooltip, Tabs, Menu } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import socketIoClient from "socket.io-client";
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
            activeTab: "active",
            searchInput: "",
            enpoint: "http://localhost:3001"
        }
    }

    componentDidMount() {

        const { enpoint } = this.state;
        const user = JSON.parse(localStorage.getItem("user"));
        const { member } = user;

        socket = socketIoClient(enpoint);

        socket.emit("join", member);

        socket.on("server-send-list-user-active", (usersActive) => {
            let index = -1;
            for (let i = 0; i < usersActive.length; i++) {
                if (usersActive[i].mEmail !== member.mEmail) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.setState({
                    usersActive,
                    receiverActive: usersActive[index],
                    filteredUsersActive: usersActive
                });
                socket.emit("client-request-content-messages", {"receiver": usersActive[index], "sender": member});
            } else {
                this.setState({ messagesChatSingle: [] })
            }
        });

        socket.on("server-send-list-user-recent", (usersRecent) => {
            if (usersRecent.length !== 0) {
                this.setState({
                    usersRecent,
                    receiverRecent: usersRecent[0],
                    filteredUsersRecent: usersRecent
                });
                socket.emit("client-request-content-messages", {"receiver": usersRecent[0], "sender": member});
            } else {
                this.setState({ messagesChatSingle: [] });
            }
        });

        socket.on("server-send-family-group", (familyGroup) => {
            if (familyGroup) {
                this.setState({ 
                    familyGroup,
                    messagesChatGroup: familyGroup.messages
                });
            } else {
                this.setState({ messagesChatGroup: [] });
            }
        });
        
        socket.on("server-response-messages-chat-single", ({ user, messages }) => {
            const {activeTab, receiverRecent, receiverActive } = this.state;
            console.log(messages)
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

        socket.on("server-response-messages-chat-group", ( messages ) => {
            this.setState({ messagesChatGroup: messages });
        });
    }

    handleClickBack = () => {
        history.goBack();
    }

    handleClickMenuActive = (e) => {

        const { usersActive } = this.state;
        const user = JSON.parse(localStorage.getItem("user"));
        const { member } = user;

        const result = usersActive.find(userActive => userActive.mSocketID === e.key);
        socket.emit("client-request-content-messages", {"receiver": result, "sender": member});
        this.setState({ receiverActive: result });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleKeyPressMessage = (e) => {

        const { message, receiverActive, receiverRecent, activeTab } = this.state;

        if (message) {
            if (e.key === "Enter") {
                const user = JSON.parse(localStorage.getItem("user"));
                const { member } = user;
                if (activeTab === "active") {
                    socket.emit("client-send-message", { "receiver": receiverActive, "sender": member, message });
                } else if (activeTab === "recent") {
                    socket.emit("client-send-message", { "receiver": receiverRecent, "sender": member, message });
                } else {
                    socket.emit("client-send-message-to-chat-group", {"member": member, "message": message});
                }
                this.setState({ message: ""});
            }
        }
    }

    handleClickMenuRecent = (e) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const { member } = user; 
        const { usersRecent } = this.state;

        const result = usersRecent.find(userRecent => userRecent.mEmail === e.key);
        socket.emit("client-request-content-messages", {"receiver": result, "sender": member});
        this.setState({ receiverRecent: result });
    }

    handleTabClick = (key) => {

        this.setState({ activeTab: key});

        const user = JSON.parse(localStorage.getItem("user"));
        const { member } = user;

        if (key === "active") {
            socket.emit("client-request-send-list-user-active", member.fID);
        } else if (key === "recent") {
            socket.emit("client-request-send-list-user-recent", member.mEmail);
        } else {
            socket.emit("client-request-send-family-group", member.fID);
        }

    }

    handleChangeSearchInput = (e) => {
        const { usersRecent, usersActive, activeTab } = this.state;
        const user = JSON.parse(localStorage.getItem("user"));
        const { member } = user;

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
                socket.emit("client-request-content-messages", {"receiver": filteredUsersRecent[0], "sender": member});
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
                if (filteredUsersActive[i].mEmail !== member.mEmail) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.setState({
                    filteredUsersActive,
                    receiverActive: filteredUsersActive[index]
                });
                socket.emit("client-request-content-messages", {"receiver": filteredUsersActive[index], "sender": member});
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

    // handleOnMouseEnter = (e) => {
    //     console.log(e);
    // }

    render() {

        const { filteredUsersActive, filteredUsersRecent, receiverActive, receiverRecent,
                messagesChatSingle, messagesChatGroup, message, activeTab, searchInput, familyGroup } = this.state;
         
        const user = JSON.parse(localStorage.getItem("user"));
        const { member } = user;

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
                        onKeyPress={this.handleKeyPressMessage}
                        onMouseEnter={this.handleOnMouseEnter}
                        onMouseLeave={this.handleOnMouseLeave}
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
                            <img className="img-header-message" src={receiverActive.mAvatar} /> &emsp;
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
                            <img className="img-header-message" src={receiverRecent.mAvatar} /> &emsp;
                            <span>
                                <div className="name-header-message">{receiverRecent.mName}</div>
                                { receiverRecent.mSocketID && <div className="active-container">  <div className="circle-active" /> &nbsp; Active  </div> }
                            </span>
                        </>
                    );
                }
            } else {
                if (familyGroup) {
                    return(
                        <>
                            <img className="img-header-message" src={familyGroup.fAvatar} /> &emsp;
                            <div className="name-header-message">{familyGroup.fName}</div>
                        </>
                    );
                }
            }
        }

        const showMessages = () => {
            if (activeTab === "family-group") {
                if (familyGroup && messagesChatGroup) {
                    return <Messages messages={messagesChatGroup} mName={member.mName}/> 
                } 
            } else {
                if ( (receiverActive || receiverRecent) && messagesChatSingle) {
                    return <Messages messages={messagesChatSingle} mName={member.mName}/> 
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
                                    <img className="img-header-chat-list" src={member.mAvatar} /> &emsp;
                                        <div className="name-header-chat-list">{member.mName}</div>
                                </Row>
                                <Row className="search-chat-list-container">
                                    <Search name="searchInput" value={searchInput} onChange={this.handleChangeSearchInput} className="search-chat-list" placeholder="search messenger" />
                                </Row>
                                <Row className="content-chat-list-container">
                                    <Tabs defaultActiveKey={activeTab} onTabClick={this.handleTabClick}>
                                        
                                        <TabPane tab="Active" key="active">
                                            { receiverActive &&
                                                <Menu style={{ borderRight: "none" }} selectedKeys={[receiverActive.mSocketID]} onClick={this.handleClickMenuActive}>
                                                    { filteredUsersActive.map((userActive) => {
                                                        return userActive.mEmail !== member.mEmail ?
                                                            <Menu.Item className="menu-item-container" key={userActive.mSocketID}>
                                                                <Row className="item-chat-list-container">
                                                                    <img className="img-item-chat-list" src={userActive.mAvatar} /> &emsp;
                                                                    <div className="name-item-chat-list">{userActive.mName}</div> &emsp; <div className="icon-active" />
                                                                </Row>
                                                            </Menu.Item>
                                                            :
                                                            null
                                                        })
                                                    }
                                                </Menu>
                                            }
                                        </TabPane>

                                        <TabPane tab="Recent" key="recent">
                                            { receiverRecent &&
                                                <Menu style={{ borderRight: "none" }} selectedKeys={[receiverRecent.mEmail]} onClick={this.handleClickMenuRecent}>
                                                    { filteredUsersRecent && filteredUsersRecent.map((userRecent) =>
                                                        <Menu.Item className="menu-item-container" key={userRecent.mEmail}>
                                                            <Row className="item-chat-list-container">
                                                                <img className="img-item-chat-list" src={userRecent.mAvatar} /> &emsp;
                                                                <div className="name-item-chat-list">{userRecent.mName}</div> &emsp; 
                                                                { userRecent.mSocketID && <div className="icon-active" /> }
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
                                                            <img className="img-item-chat-list"  src={familyGroup.fAvatar}/> &emsp;
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
                                    { headerBodyMessage() }
                                </Row>
                                <Row className="content-message-container">
                                    { showMessages() }
                                </Row>
                                { showToolBar() }
                            </Col>
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default ChatContainer;