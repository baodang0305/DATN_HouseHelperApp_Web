import React from "react";
import { Picker } from "emoji-mart";
import { connect } from "react-redux";
import socketIoClient from "socket.io-client";
import { LeftOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Button, Input, Tabs, Menu } from "antd";

import "./ChatContainer.css";
import "emoji-mart/css/emoji-mart.css";
import Messages from "../Messages/Messages";
import history from "../../../../helpers/history";
import DashboardMenu from "../../../DashboardMenu/DashboardMenu";
import { indexConstants } from "../../../../constants/index.constants";

const { Search } = Input;
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

let socket;

class ChatContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            caller: null,
            searchInput: "",
            usersActive: [],
            usersRecent: [],
            isAccepted: false,
            showCamera: false,
            familyGroup: null,
            receiverCall: null,
            isShowEmojis: false,
            activeTab: "active",
            receiverActive: null,
            receiverRecent: null,
            filteredUsersActive: [],
            filteredUsersRecent: [],
            userIsEnteringGroup: null,
            userIsEnteringSingle: null,
            enpoint: "http://localhost:3001",
        }
    }

    handleClickBack = () => {

        history.push("/family");
        socket.emit("leave-chat");

    }

    handleChange = (e) => {

        const { name, value } = e.target;
        this.setState({ [name]: value });

    }

    handleTabClick = (key) => {
        this.setState({ activeTab: key });
    }

    componentDidMount() {

        const { user } = this.props;
        const { enpoint } = this.state;

        socket = socketIoClient(enpoint);

        socket.emit("join", user);

        // const config = { host: "chat-video-with-peer-server.herokuapp.com", port: 443, secure: true, key: "peerjs" }
        // peer = new Peer(user._id, config);

        // peer.on("call", call => {
        //     console.log("ta đã vào")
        //     if (call) {
        //         this.setState({ receiverCall: call });
        //     }
        // });

        // peer.on("close", () => {
        //     console.log("người gọi đã đóng kết nối");
        // });

        socket.on("server-send-user-active", (userActive) => {

            const { usersActive, usersRecent } = this.state;

            // thêm user active vào usersActive
            let newUsersActive = [...usersActive];
            newUsersActive = [...newUsersActive, userActive];
            this.setState({ usersActive: newUsersActive, receiverActive: newUsersActive[0], filteredUsersActive: newUsersActive });

            // cập nhật mSocketID cho usersRecent (nếu có)
            if (usersRecent.length !== 0) {

                let newUsersRecent = [...usersRecent];
                const indexRecent = newUsersRecent.findIndex(element => element.mID === userActive.mID);

                if (indexRecent !== -1) {

                    newUsersRecent[indexRecent].mSocketID = userActive.mSocketID;
                    this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

                }

            }

        });

        socket.on("server-send-list-user-active", (usersActive) => {

            if (usersActive.length !== 0) {

                this.setState({ usersActive: usersActive, receiverActive: usersActive[0], filteredUsersActive: usersActive });

            }

        });

        socket.on("server-response-list-user-recent", (usersRecent) => {

            if (usersRecent.length !== 0) {

                this.setState({ usersRecent: usersRecent, receiverRecent: usersRecent[0], filteredUsersRecent: usersRecent });

            }

        });

        socket.on("server-send-user-leave", ({ mSocketID }) => {

            const { usersActive, usersRecent } = this.state;

            if (mSocketID) {

                //Xóa user active đã rời khỏi
                let newUsersActive = [...usersActive];
                const indexActive = newUsersActive.findIndex(element => element.mSocketID === mSocketID);

                if (indexActive !== -1) {

                    newUsersActive.splice(indexActive, 1);

                    if (newUsersActive.length === 0) {

                        this.setState({ usersActive: [], receiverActive: null, filteredUsersActive: [] });

                    } else {

                        this.setState({ usersActive: newUsersActive, receiverActive: newUsersActive[0], filteredUsersActive: newUsersActive });

                    }
                }

                //cập nhật mSocketID của user trong usersRecent
                let newUsersRecent = [...usersRecent];
                let indexRecent = newUsersRecent.findIndex(element => element.mSocketID === mSocketID);

                if (indexRecent !== -1) {

                    newUsersRecent[indexRecent].mSocketID = "";
                    this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

                }

            }

        });

        socket.on("server-response-message-chat-single", ({ sender, messageContainer }) => {

            const { user } = this.props;
            const { usersActive, usersRecent, receiverActive, receiverRecent, activeTab } = this.state;

            const indexActive = usersActive.findIndex(element => sender.mID === element.mID);
            const indexRecent = usersRecent.findIndex(element => sender.mID === element.mID);

            let isSeen = false;

            let receiver;
            if (activeTab === "active") {
                if (receiverActive.mID === sender.mID) {
                    receiver = { ...receiverActive };
                }
            } else {
                if (receiverRecent.mID === sender.mID) {
                    receiver = { ...receiverRecent };
                }
            }

            if (receiver) {
                isSeen = true;
                delete receiver.messages;
                const sender = { ...user, "mID": user._id };
                delete sender._id;
                socket.emit("message-has-seen", { sender, receiver, messageContainer });
            }

            let updateStateMessage = { ...messageContainer };
            updateStateMessage.seen = isSeen;

            if (indexActive !== -1) {

                let newUsersActive = [...usersActive];
                newUsersActive[indexActive].messages = [...newUsersActive[indexActive].messages, updateStateMessage]
                this.setState({ usersActive: newUsersActive, filteredUsersActive: newUsersActive });

            }

            if (indexRecent !== -1) {

                let newUsersRecent = [...usersRecent];
                newUsersRecent[indexRecent].messages = [...newUsersRecent[indexRecent].messages, updateStateMessage]
                this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

            }

        });

        socket.on("server-response-user-is-entering-to-partner", (sender) => {

            const { activeTab, receiverActive, receiverRecent } = this.state;

            if (activeTab === "recent") {

                if (sender.mID === receiverRecent.mID) {

                    this.setState({ userIsEnteringSingle: sender });

                }

            } else if (activeTab === "active") {

                if (sender.mID === receiverActive.mID) {

                    this.setState({ userIsEnteringSingle: sender });

                }

            }

        });

        socket.on("server-response-user-is-stoped-entering-to-partner", (sender) => {

            const { activeTab, receiverActive, receiverRecent } = this.state;

            if (activeTab === "recent") {

                if (sender.mID === receiverRecent.mID) {

                    this.setState({ userIsEnteringSingle: null });

                }

            } else if (activeTab === "active") {

                if (sender.mID === receiverActive.mID) {

                    this.setState({ userIsEnteringSingle: null });

                }

            }

        });

        socket.on("server-response-message-has-seen", ({ sender, messageContainer }) => {

            const { usersActive, usersRecent } = this.state;

            if (usersActive.length !== 0) {

                const indexActive = usersActive.findIndex(element => element.mID === sender.mID);

                if (indexActive !== -1) {

                    let newUsersActive = [...usersActive];
                    let messagesActive = [...newUsersActive[indexActive].messages];
                    messagesActive[messagesActive.length - 1].seen = true;
                    newUsersActive[indexActive].messages = messagesActive;
                    this.setState({ usersActive: newUsersActive, filteredUsersActive: newUsersActive });

                }

            }

            if (usersRecent.length !== 0) {

                const indexRecent = usersRecent.findIndex(element => element.mID === sender.mID);

                if (indexRecent !== -1) {

                    let newUsersRecent = [...usersRecent];
                    let messagesRecent = [...newUsersRecent[indexRecent].messages];
                    messagesRecent[messagesRecent.length - 1].seen = true;
                    newUsersRecent[indexRecent].messages = messagesRecent;
                    this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

                }

            }

        });


        socket.on("server-send-family-group", (familyGroup) => {

            const newFamilyGroup = { ...familyGroup }

            if (familyGroup) {

                this.setState({ familyGroup: newFamilyGroup });

            }

        });

        socket.on("server-response-messages-chat-group", (messageContainer) => {

            const { familyGroup } = this.state;

            if (messageContainer) {

                let newFamilyGroup = { ...familyGroup };
                newFamilyGroup.messages = [...newFamilyGroup.messages, messageContainer];
                this.setState({ familyGroup: newFamilyGroup });

            }

        });

        socket.on("server-response-user-is-entering-to-group", (sender) => {

            this.setState({ userIsEnteringGroup: sender });

        });

        socket.on("server-response-user-is-stoped-entering-to-group", (sender) => {

            this.setState({ userIsEnteringGroup: null });

        });

    }

    handleClickMenuActive = (e) => {

        const { user } = this.props;
        const { usersActive, usersRecent } = this.state;

        const indexActive = usersActive.findIndex(item => item.mSocketID === e.key);

        if (indexActive !== -1) {

            let newUsersActive = [...usersActive];
            const lengthMessagesActive = newUsersActive[indexActive].messages.length;

            if (lengthMessagesActive !== 0) {

                let lastMessage = { ...newUsersActive[indexActive].messages[lengthMessagesActive - 1] }

                if (lastMessage.seen === false && lastMessage.id !== user._id) {

                    lastMessage.seen = true;
                    newUsersActive[indexActive].messages[lengthMessagesActive - 1] = lastMessage;
                    this.setState({ usersActive: newUsersActive, filteredUsersActive: newUsersActive });

                    //update tab recent nếu có
                    const mID = newUsersActive[indexActive].mID;

                    if (usersRecent.length !== 0 && mID) {

                        const indexRecent = usersRecent.findIndex(element => element.mID === mID);

                        if (indexRecent !== -1) {

                            let newUsersRecent = [...usersRecent];
                            newUsersRecent[indexRecent].messages = newUsersActive[indexActive].messages;
                            this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

                        }

                    }

                    //emit to server that server update state of last message is seen
                    let receiver = { ...newUsersActive[indexActive] };
                    delete receiver.messages;
                    let sender = { ...user, "mID": user._id };
                    delete sender._id;
                    socket.emit("message-has-seen", { sender, receiver, "messageContainer": lastMessage });

                }
            }

            this.setState({ message: "", receiverActive: newUsersActive[indexActive] });
        }
    }

    handleKeyPressMessage = (e) => {

        const { user } = this.props;
        const { message, receiverActive, receiverRecent, activeTab, usersActive, usersRecent, familyGroup } = this.state;

        const messageTemp = message.trim();

        if (messageTemp !== "") {
            if (e.key === "Enter") {

                const messageContainer = {
                    "seen": false,
                    "id": user._id,
                    "name": user.mName,
                    "message": messageTemp,
                    "avatar": { "image": user.mAvatar.image, "color": user.mAvatar.color }
                }

                if (activeTab === "family-group") {

                    let member = { ...user, "mID": user._id };
                    delete member._id;
                    socket.emit("client-send-message-to-chat-group", { member, messageContainer });

                } else {

                    let receiver;

                    if (activeTab === "active") {
                        receiver = { ...receiverActive };

                    } else {
                        receiver = { ...receiverRecent };

                    }

                    delete receiver.messages;

                    let sender = { ...user, "mID": user._id };
                    delete sender._id;
                    socket.emit("client-send-message", { "receiver": receiver, sender, messageContainer });

                    if (usersActive) {

                        const indexActive = usersActive.findIndex(element => element.mID === receiver.mID);

                        if (indexActive !== -1) {

                            let newUsersActive = [...usersActive];
                            newUsersActive[indexActive].messages = [...newUsersActive[indexActive].messages, messageContainer]
                            this.setState({ usersActive: newUsersActive, filteredUsersActive: newUsersActive });

                        }
                    }

                    if (usersRecent) {

                        const indexRecent = usersRecent.findIndex(element => element.mID === receiver.mID);

                        if (indexRecent !== -1) {

                            let newUsersRecent = [...usersRecent];
                            newUsersRecent[indexRecent].messages = [...newUsersRecent[indexRecent].messages, messageContainer];
                            this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

                        }

                    }

                }

                this.setState({ message: "", isShowEmojis: false });
            }
        }
    }

    handleClickMenuRecent = (e) => {

        const { user } = this.props;
        const { usersRecent, usersActive } = this.state;

        const indexRecent = usersRecent.findIndex(element => element.mID === e.key);

        if (indexRecent !== -1) {

            let newUsersRecent = [...usersRecent];
            const lengthMessagesRecent = newUsersRecent[indexRecent].messages.length;

            if (lengthMessagesRecent !== 0) {

                let lastMessage = { ...newUsersRecent[indexRecent].messages[lengthMessagesRecent - 1] }

                if (lastMessage.seen === false && lastMessage.id !== user._id) {

                    lastMessage.seen = true;
                    newUsersRecent[indexRecent].messages[lengthMessagesRecent - 1] = lastMessage;

                    this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });

                    // update tab active nếu có
                    let mSocketID = newUsersRecent[indexRecent].mSocketID;

                    if (usersActive.length !== 0 && mSocketID) {

                        const indexActive = usersActive.findIndex(element => element.mSocketID === mSocketID);

                        if (indexActive !== -1) {

                            let newUsersActive = [...usersActive];
                            newUsersActive[indexActive].messages = newUsersRecent[indexRecent].messages;

                            this.setState({ usersActive: newUsersActive, filteredUsersActive: newUsersActive })
                        }

                    }

                    //emit to server that server update state of last message is seen
                    let receiver = { ...newUsersRecent[indexRecent] };
                    delete receiver.messages;
                    let sender = { ...user, "mID": user._id };
                    delete sender._id;
                    socket.emit("message-has-seen", { sender, receiver, "messageContainer": lastMessage });
                }
            }

            this.setState({ message: "", receiverRecent: newUsersRecent[indexRecent] });

        }
    }

    handleChangeSearchInput = (e) => {

        const { name, value } = e.target;
        const { usersRecent, usersActive, activeTab } = this.state;

        if (activeTab === "recent") {

            const filteredUsersRecent = usersRecent.filter(element => {
                return element.mName.toLowerCase().includes(value.toLowerCase());
            });

            if (filteredUsersRecent.length === 0) {

                this.setState({ receiverRecent: null, filteredUsersRecent: [] });

            } else {

                this.setState({ filteredUsersRecent, receiverRecent: filteredUsersRecent[0] });

            }

        } else {

            const filteredUsersActive = usersActive.filter(element => {
                return element.mName.toLowerCase().includes(value.toLowerCase());
            });

            if (filteredUsersActive.length === 0) {

                this.setState({ receiverActive: null, filteredUsersActive: null });

            } else {

                this.setState({ filteredUsersActive, receiverActive: filteredUsersActive[0] });

            }

        }

        this.setState({ [name]: value });

    }

    handleOnFocus = () => {

        let receiver;
        const { user } = this.props;
        const { activeTab, receiverActive, receiverRecent, familyGroup } = this.state;

        if (activeTab === "active") {
            receiver = { ...receiverActive };

        } else if (activeTab === "recent") {
            receiver = { ...receiverRecent };

        } else {
            receiver = { ...familyGroup }

        }

        delete receiver.messages;
        let sender = { ...user, "mID": user._id }
        delete sender._id;
        socket.emit("client-notification-is-entering", { sender, receiver });

    }

    handleOnBlur = () => {

        let receiver;
        const { user } = this.props;
        const { activeTab, receiverRecent, receiverActive, familyGroup } = this.state;

        if (activeTab === "active") {

            receiver = { ...receiverActive };

        } else if (activeTab === "recent") {

            receiver = { ...receiverRecent };

        } else {

            receiver = { ...familyGroup };

        }

        delete receiver.messages;
        let sender = { ...user, "mID": user._id };
        delete sender._id;
        socket.emit("client-notification-is-stoped-entering", { sender, receiver });

    }

    addEmoji = e => {
        const emoji = e.native;
        this.setState({ message: this.state.message + emoji });
    };

    showEmojis = e => {
        this.setState({ isShowEmojis: !this.state.isShowEmojis });
    };

    // handleClickCamera = () => {

    //     try {
    //         let receiver;
    //         const { receiverActive, receiverRecent, activeTab } = this.state;
    //         if (activeTab === "active") {
    //             if (receiverActive) {
    //                 receiver = { ...receiverActive };
    //             }

    //         } else if (activeTab === "recent") {

    //             if (receiverRecent && !receiverRecent.mSocketID) {
    //                 receiver = { ...receiverRecent };
    //             }
    //         }

    //         if (receiver) {


    //             navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //                 .then(function (stream) {
                        
    //                 })
    //                 .catch(function (err) {
    //                     console.log(err)
    //                 });

    //             navigator.mediaDevices.getUserMedia({ video: true, audio: true }, function (stream) {
    //                 const call = peer.call(receiver.mID, stream);
    //                 console.log(call)
    //                 call.on('stream', function (remoteStream) {
    //                     // Show stream in some video/canvas element.
    //                 });
    //             }, function (err) {
    //                 console.log('Failed to get local stream', err);
    //             })

    //             navigator.mediaDevices.getUserMedia({ video: true, audio: true }, function (stream) {
    //                 console.log(stream)
    //                 const call = peer.call(receiver.mID, stream);
    //                 console.log(call)
    //                 call.on("stream", remoteStream => {

    //                     const video = document.getElementById("localVideo");
    //                     video.srcObject = remoteStream;
    //                     video.onloadedmetadata = function () {
    //                         video.play();
    //                     }
    //                 });

    //                 this.setState({ caller: call, isAccepted: false });
    //             })
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // handleClickAccept = () => {

    //     const { receiverCall } = this.state;

    //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //         .then(stream => {
    //             receiverCall.answer(stream);
    //             receiverCall.on("stream", remoteStream => {
    //                 const video = document.getElementById("localVideo");
    //                 video.srcObject = remoteStream;
    //                 video.onloadedmetadata = function () {
    //                     video.play();
    //                 }
    //             });
    //         });

    //     this.setState({ isAccepted: true });
    // }

    // callerClickClose = () => {
    //     const { caller } = this.state;
    //     const stream = caller.localStream;
    //     console.log(stream)
    //     if (stream) {
    //         stream.getTracks().forEach(function (track) { track.stop(); });
    //     }
    //     caller.close();
    //     this.setState({ caller: null, receiverClickClose: null });
    // }

    // receiverClickClose = () => {
    //     const { receiverCall } = this.state;
    //     const streamLocal = receiverCall.localStream;
    //     const streamRemote = receiverCall.remoteStream;

    //     if (streamLocal) {
    //         streamLocal.getTracks().forEach(function (track) { track.stop(); });
    //     }
    //     if (streamRemote) {
    //         streamRemote.getTracks().forEach(function (track) { track.stop(); });
    //     }
    //     receiverCall.close();
    //     this.setState({ receiverCall: null, caller: null });
    // }

    render() {

        const {
            message,
            activeTab,
            searchInput,
            familyGroup,
            receiverActive,
            receiverRecent,
            userIsEnteringGroup,
            filteredUsersActive,
            filteredUsersRecent,
            userIsEnteringSingle
        } = this.state;

        const { user } = this.props;

        const toolBar = () => (

            <Row className="tool-bar-container">
                <Col>
                    <i onClick={this.handleClickCamera} style={{ cursor: "pointer" }} className="fa fa-camera fa-lg"></i> &ensp;
                    <i className="fa fa-microphone fa-lg" ></i> &ensp;
                    <i className="fa fa-image fa-lg"></i> &ensp;
                </Col>
                <Col flex="auto">
                    <Input
                        name="message"
                        value={message}
                        onBlur={this.handleOnBlur}
                        style={{ borderRadius: 5 }}
                        onChange={this.handleChange}
                        onFocus={this.handleOnFocus}
                        placeholder="Type a message..."
                        onPressEnter={this.handleKeyPressMessage}
                        suffix={[
                            <div onClick={this.showEmojis} style={{ width: 20, cursor: "pointer" }}>
                                {String.fromCodePoint(0x1f60a)}
                            </div>
                        ]}
                    />
                </Col>

                {this.state.isShowEmojis &&
                    <Picker
                        onSelect={this.addEmoji}
                        style={{ position: 'absolute', bottom: '50px', right: '20px' }}
                    />
                }

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
                            <img
                                className="img-header-message"
                                src={receiverActive.mAvatar.image}
                                style={{ backgroundColor: receiverActive.mAvatar.color }}
                            /> &emsp;
                            <span>
                                <div style={{ fontWeight: "bolder" }}>{receiverActive.mName}</div>
                                <div className="active-container">
                                    <div className="circle-active" /> &nbsp; Active
                                </div>
                            </span>
                        </>
                    );

                }

            } else if (activeTab === "recent") {
                if (receiverRecent) {
                    return (
                        <>
                            <img
                                className="img-header-message"
                                src={receiverRecent.mAvatar.image}
                                style={{ backgroundColor: receiverRecent.mAvatar.color }}
                            /> &emsp;
                            <span>
                                <div style={{ fontWeight: "bolder" }}>{receiverRecent.mName}</div>
                                {receiverRecent.mSocketID &&
                                    <div className="active-container">
                                        <div className="circle-active" /> &nbsp; Active
                                    </div>
                                }
                            </span>
                        </>
                    );

                }

            } else {

                if (familyGroup) {
                    return (
                        <>
                            <img className="img-header-message" src={familyGroup.fImage} /> &emsp;
                            <div style={{ fontWeight: "bold" }}>{familyGroup.fName}</div>
                        </>
                    );

                }

            }

        }

        const showMessages = () => {

            if (activeTab === "family-group") {

                if (familyGroup) {

                    if (userIsEnteringGroup && userIsEnteringGroup.mID !== user._id) {

                        return <Messages messages={familyGroup.messages} userIsEntering={userIsEnteringGroup} mID={user._id} />

                    }

                    return <Messages messages={familyGroup.messages} mID={user._id} />

                }

            } else if (activeTab === "active") {

                if (receiverActive) {

                    if (userIsEnteringSingle && userIsEnteringSingle.mID !== receiverActive.mID) {

                        return <Messages messages={receiverActive.messages} mID={user._id} />

                    } else {

                        return <Messages messages={receiverActive.messages} userIsEntering={userIsEnteringSingle} mID={user._id} />

                    }

                }

            } else {

                if (receiverRecent) {

                    if (userIsEnteringSingle && userIsEnteringSingle.mID !== receiverRecent.mID) {

                        return <Messages messages={receiverRecent.messages} mID={user._id} />

                    } else {

                        return <Messages messages={receiverRecent.messages} userIsEntering={userIsEnteringSingle} mID={user._id} />

                    }

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
                            <Col flex="auto"> <div className="title-header"> Message </div> </Col>
                        </Row>

                    </Header>

                    <Content style={{ margin: 20 }}>

                        <Row className="chat-container">
                            <Col span={8} style={{ borderRight: "groove thin" }}>
                                <Row className="header-chat-list-container">
                                    <img
                                        src={user.mAvatar.image}
                                        className="img-header-chat-list"
                                        style={{ backgroundColor: user.mAvatar.color }}
                                    /> &emsp;
                                    <div className="name-header-chat-list">{user.mName}</div>
                                </Row>
                                <Row style={{ padding: 10 }}>
                                    <Search
                                        name="searchInput" value={searchInput}
                                        onChange={this.handleChangeSearchInput}
                                        style={{ borderRadius: 5 }} placeholder="search messenger"
                                    />
                                </Row>
                                <Row style={{ padding: 10 }} >

                                    <Tabs defaultActiveKey={activeTab} onTabClick={this.handleTabClick} style={{ width: "100%" }}>

                                        <TabPane tab="Active" key="active">
                                            {receiverActive &&
                                                <Menu
                                                    style={{ borderRight: "none" }}
                                                    onClick={this.handleClickMenuActive}
                                                    selectedKeys={[receiverActive.mSocketID]}
                                                >
                                                    {filteredUsersActive.length !== 0 && filteredUsersActive.map((item) => {
                                                        return (
                                                            <Menu.Item className="menu-item-container" key={item.mSocketID}>
                                                                <Row align="middle" justify="start">
                                                                    <div className="img-chat-list-container">
                                                                        <img
                                                                            src={item.mAvatar.image}
                                                                            className="img-chat-list"
                                                                            style={{ backgroundColor: item.mAvatar.color }}
                                                                        />
                                                                        <div className="icon-active" />
                                                                    </div>
                                                                    <div style={{ float: "right", marginLeft: 10 }} >
                                                                        {item.messages.length === 0 ?
                                                                            <div className="name-item-chat-list">{item.mName}</div>
                                                                            :
                                                                            <>
                                                                                {user.mName === item.messages[item.messages.length - 1].name ?
                                                                                    <>
                                                                                        <div className="name-item-chat-list">{item.mName}</div>
                                                                                        <div className="message-under-name-chat-list"> You: {item.messages[item.messages.length - 1].message} </div>
                                                                                    </>
                                                                                    :
                                                                                    item.messages[item.messages.length - 1].seen ?
                                                                                        <>
                                                                                            <div className="name-item-chat-list">{item.mName}</div>
                                                                                            <div className="message-under-name-chat-list"> {item.messages[item.messages.length - 1].message} </div>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <div style={{ fontWeight: "bold" }} className="name-item-chat-list">{item.mName}</div>
                                                                                            <div className="message-under-name-chat-list" style={{ fontWeight: "bold" }} > {item.messages[item.messages.length - 1].message} </div>
                                                                                        </>
                                                                                }
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </Row>
                                                            </Menu.Item>
                                                        )
                                                    })}
                                                </Menu>
                                            }
                                        </TabPane>

                                        <TabPane tab="Recent" key="recent">
                                            {receiverRecent &&
                                                <Menu
                                                    style={{ borderRight: "none" }}
                                                    onClick={this.handleClickMenuRecent}
                                                    selectedKeys={[receiverRecent.mID]}
                                                >
                                                    {filteredUsersRecent && filteredUsersRecent.map((item) =>
                                                        <Menu.Item className="menu-item-container" key={item.mID}>
                                                            <Row align="middle" justify="start">

                                                                <div className="img-chat-list-container">
                                                                    <img
                                                                        src={item.mAvatar.image}
                                                                        className="img-chat-list"
                                                                        style={{ backgroundColor: item.mAvatar.color }}
                                                                    />
                                                                    {item.mSocketID && <div className="icon-active" />}
                                                                </div>
                                                                <div style={{ float: "right", marginLeft: 10 }} >

                                                                    {item.messages.length === 0 ?
                                                                        <div className="name-item-chat-list">{item.mName}</div>
                                                                        :
                                                                        <>
                                                                            {user.mName === item.messages[item.messages.length - 1].name ?
                                                                                <>
                                                                                    <div className="name-item-chat-list">{item.mName}</div>
                                                                                    <div className="message-under-name-chat-list"> You: {item.messages[item.messages.length - 1].message} </div>
                                                                                </>
                                                                                :
                                                                                item.messages[item.messages.length - 1].seen ?
                                                                                    <>
                                                                                        <div className="name-item-chat-list">{item.mName}</div>
                                                                                        <div className="message-under-name-chat-list"> {item.messages[item.messages.length - 1].message} </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <div style={{ fontWeight: "bold" }} className="name-item-chat-list">{item.mName}</div>
                                                                                        <div className="message-under-name-chat-list" style={{ fontWeight: "bold" }} > {item.messages[item.messages.length - 1].message} </div>
                                                                                    </>
                                                                            }
                                                                        </>
                                                                    }
                                                                </div>
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
                                                        <Row align="middle" justify="start">
                                                            <div className="img-chat-list-container">
                                                                <img className="img-chat-list" src={familyGroup.fImage} />
                                                            </div>
                                                            <div style={{ float: "right", marginLeft: 10 }} >
                                                                <div className="name-item-chat-list"> {familyGroup.fName} </div>
                                                            </div>
                                                        </Row>
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                        </TabPane>

                                    </Tabs>
                                </Row>
                            </Col>
                            <Col flex="auto">
                                <Row className="header-message-container"> {headerBodyMessage()} </Row>
                                <Row className="content-message-container"> {showMessages()} </Row>
                                {showToolBar()}
                            </Col>
                            {/* {this.state.caller &&
                                <Col span={8} style={{ display: "block" }}>
                                    <video style={{ width: "100%", height: "auto" }} id="localVideo" controls />
                                    <Button onClick={this.callerClickClose}> Close </Button>
                                </Col>
                            }
                            {this.state.receiverCall &&
                                <Col span={8} style={{ display: "block" }}>
                                    <video style={{ width: "100%", height: "auto" }} id="localVideo" controls />
                                    <Button onClick={this.receiverClickClose}> Close </Button>
                                    {!this.state.isAccepted ? <Button onClick={this.handleClickAccept}> Accept Call </Button> : null}
                                </Col>
                            } */}
                        </Row>

                    </Content>

                    <Footer style={{ textAlign: 'center' }}> </Footer>

                </Layout>

            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    const { inforLogin } = state.authentication;
    return {
        user: inforLogin.user
    }
}

export default connect(mapStateToProps)(ChatContainer);