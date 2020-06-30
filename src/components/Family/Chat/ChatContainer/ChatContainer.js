import React from "react";
import { Picker } from "emoji-mart";
import { connect } from "react-redux";
import { Prompt } from "react-router-dom";
import socketIoClient from "socket.io-client";
import { LeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout, Row, Col, Button, Input, Tabs, Menu, Modal, Avatar } from "antd";
import { faPhone, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";

import "./ChatContainer.css";
import "emoji-mart/css/emoji-mart.css";
import Messages from "../Messages/Messages";
import history from "../../../../helpers/history";
import DashboardMenu from "../../../DashboardMenu/DashboardMenu";
import { indexConstants } from "../../../../constants/index.constants";

let socket;
const { Search } = Input;
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

class ChatContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            peerConn: null,
            searchInput: "",
            usersActive: [],
            usersRecent: [],
            userOffer: null,
            userIsOffer: null,
            isAccepted: false,
            localStream: null,
            familyGroup: null,
            isShowEmojis: false,
            activeTab: "active",
            activeKeyTabMobileChat: "members",
            receiverActive: null,
            receiverRecent: null,
            filteredUsersActive: [],
            filteredUsersRecent: [],
            userIsEnteringGroup: null,
            userIsEnteringSingle: null,
            enpoint: indexConstants.ENPOINT_SOCKET,

            lastLocation: null,
            modalVisible: false,
            confirmedNavigation: false

        }

        this.localVideo = React.createRef();
        this.remoteVideo = React.createRef();
        this.toggleContainer = React.createRef();
        this.ringtone = new Audio(indexConstants.CALL_RINGTONE_COME_IN);
        this.outgoingCallingBell = new Audio(indexConstants.OUTGOING_CALLING_BELL);
    }

    handleClickBack = () => {
        history.push("/family");
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleTabClick = (key) => {
        this.setState({ activeTab: key });
    }

    getIceServers = async () => {
        let o = { format: "urls", "expire": "6000" };
        let bodyString = JSON.stringify(o);
        const response = await fetch(`https://global.xirsys.net/_turn/video-call-chanel`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": bodyString.length,
                "Authorization": "Basic " + Buffer.from("BaoDang:17f07744-8566-11ea-8d7b-0242ac130006").toString("base64")
            }
        })

        const data = await response.json();
        return data.v;
    }

    async componentDidMount() {

        const { user } = this.props;
        const { enpoint } = this.state;

        socket = socketIoClient(enpoint);

        socket.emit("join", user);

        socket.on("server-send-user-active", (userActive) => {
            const { usersActive, usersRecent } = this.state;

            // thêm user active vào usersActive
            let newUsersActive = [...usersActive];
            newUsersActive = [...newUsersActive, userActive];
            this.setState({
                usersActive: newUsersActive,
                receiverActive: newUsersActive[0],
                filteredUsersActive: newUsersActive
            });

            // cập nhật mSocketID cho usersRecent (nếu có)
            if (usersRecent.length !== 0) {
                const indexRecent = usersRecent.findIndex(element => element.mID === userActive.mID);
                if (indexRecent !== -1) {
                    let newUsersRecent = [...usersRecent];
                    newUsersRecent[indexRecent].mSocketID = userActive.mSocketID;
                    this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });
                } else {
                    let newUsersRecent = [...usersRecent, userActive];
                    this.setState({ usersRecent: newUsersRecent, filteredUsersRecent: newUsersRecent });
                }
            } else {
                this.setState({ usersRecent: [...userActive], filteredUsersRecent: [...userActive] });
            }
        });

        socket.on("server-send-list-users-active", (usersActive) => {
            if (usersActive.length !== 0) {
                this.setState({
                    usersActive,
                    receiverActive: usersActive[0],
                    filteredUsersActive: usersActive
                });

            }
        });

        socket.on("server-send-list-users-recent", (usersRecent) => {
            if (usersRecent.length !== 0) {
                this.setState({ usersRecent, receiverRecent: usersRecent[0], filteredUsersRecent: usersRecent });
            }
        });

        socket.on("server-send-user-leave", async ({ mSocketID }) => {

            const { usersActive, usersRecent, userOffer, userIsOffer } = this.state;

            if (mSocketID) {

                if (userIsOffer && userIsOffer.mSocketID === mSocketID) {
                    this.outgoingCallingBell.pause();
                    this.setState({ userIsOffer: null });
                } else if (userOffer && userOffer.mSocketID === mSocketID) {
                    this.ringtone.pause();
                    this.setState({ userOffer: null });
                }

                // Xóa user active đã rời khỏi
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
                if (receiverRecent) {
                    if (sender.mID === receiverRecent.mID) {
                        this.setState({ userIsEnteringSingle: sender });
                    }
                }
            } else if (activeTab === "active") {
                if (receiverActive) {
                    if (sender.mID === receiverActive.mID) {
                        this.setState({ userIsEnteringSingle: sender });
                    }
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

        socket.on("offer-a-call", (userOffer) => {
            if (!this.state.userOffer && !this.state.userIsOffer) {
                this.ringtone.play();
                this.ringtone.loop = true;
                this.setState({ userOffer });
            } else {
                socket.emit("answer-offer-a-call", { "receiver": userOffer, "content": { "accept": false, "message": "đang bận" } });
            }
        });

        socket.on("cancel-offer-a-call", () => {
            this.ringtone.pause();
            this.setState({ userOffer: null });
        });

        socket.on("answer-offer-a-call", async ({ sender, content }) => {
            this.outgoingCallingBell.pause();
            if (!content.accept) {
                alert(`${sender.mName} ${content.message}`);
                this.setState({ userIsOffer: null });
            } else {
                const newConfig = await this.getIceServers();
                const newPeerConn = new RTCPeerConnection(newConfig);
                this.setState({ peerConn: newPeerConn, isAccepted: true });
                this.handleMakeCall({ "mSocketID": sender.mSocketID });
            }
        });

        socket.on("offer", ({ mSocketID, offer }) => {
            this.handleOffer(mSocketID, offer)
        });

        socket.on("answer", ({ mSocketID, answer }) => {
            this.handleAnswer(mSocketID, answer);
        });

        socket.on("candidate", ({ mSocketID, candidate }) => {
            this.handleCandidate(mSocketID, candidate);
        });

        window.addEventListener("click", this.onClickOutsideHandler);

    }

    componentWillUnmount() {
        socket && socket.connected && socket.close();
    }

    onClickOutsideHandler = (event) => {
        if (this.state.isShowEmojis && !this.toggleContainer.current.contains(event.target)) {
            this.setState({ isShowEmojis: false });
        }
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
    }

    handleOfferCall = () => {
        const { userIsOffer, userOffer, receiverActive } = this.state;
        if (!userIsOffer && !userOffer) {
            this.outgoingCallingBell.play();
            this.outgoingCallingBell.loop = true;
            const userIsOffer = { ...receiverActive };
            delete userIsOffer.messages;
            socket.emit("offer-a-call", userIsOffer);
            this.setState({ userIsOffer });
        } else {
            alert("Bạn không thể gọi 1 lúc 2 người");
        }
    }

    handleAccept = async () => {
        const { userOffer } = this.state;
        this.ringtone.pause();
        const newConfig = await this.getIceServers();
        const newPeerConn = new RTCPeerConnection(newConfig);
        this.setState({ peerConn: newPeerConn, isAccepted: true });
        socket.emit("answer-offer-a-call", { "receiver": userOffer, "content": { "accept": true } });
    }

    handleClose = async () => {
        const { isAccepted, userIsOffer, userOffer, localStream, peerConn } = this.state;
        if (!isAccepted) {
            if (userIsOffer) {
                this.outgoingCallingBell.pause();
                this.setState({ userIsOffer: null });
                socket.emit("cancel-offer-a-call", { "receiver": userIsOffer });
            } else if (userOffer) {
                this.ringtone.pause();
                this.setState({ userOffer: null });
                socket.emit("answer-offer-a-call", { "receiver": userOffer, "content": { "accept": false, "message": "từ chối cuộc gọi" } });
            }
        } else {
            if (localStream) {
                localStream.getAudioTracks()[0].stop();
                localStream.getVideoTracks()[0].stop();
            }
            if (peerConn) {
                peerConn.removeStream(localStream)
                peerConn.close();
            }
            this.localVideo.current.srcObject = null;
            this.remoteVideo.current.srcObject = null;
            this.setState({ userOffer: null, userIsOffer: null, isAccepted: false, localStream: null, peerConn: null });
        }
    }

    handleMakeCall = async ({ mSocketID }) => {
        const { peerConn } = this.state;
        const newLocalStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        this.localVideo.current.srcObject = newLocalStream;
        peerConn.addStream(newLocalStream);
        this.setState({ localStream: newLocalStream });
        peerConn.createOffer((offer) => {
            peerConn.setLocalDescription(offer);
            socket.emit("offer", { mSocketID, offer });
        }, function (error) {
            console.log("error when create an offer");
        });
        peerConn.onaddstream = (e) => {
            this.remoteVideo.current.srcObject = e.stream;
        };
        peerConn.onicecandidate = (event) => {
            const cand = event.candidate;
            if (cand) {
                const { userOffer, userIsOffer } = this.state;
                if (userOffer) {
                    socket.emit("candidate", { "mSocketID": userOffer.mSocketID, "candidate": cand });
                } else if (userIsOffer) {
                    socket.emit("candidate", { "mSocketID": userIsOffer.mSocketID, "candidate": cand });
                }
            }
        };
        peerConn.onconnectionstatechange = async (event) => {
            if (peerConn.connectionState === "disconnected") {
                const { localStream } = this.state;
                if (localStream) {
                    localStream.getAudioTracks()[0].stop();
                    localStream.getVideoTracks()[0].stop();
                }
                peerConn.removeStream(localStream);
                peerConn.close();
                this.localVideo.current.srcObject = null;
                this.remoteVideo.current.srcObject = null;
                this.setState({ userOffer: null, userIsOffer: null, isAccepted: false, localStream: null, peerConn: null });
            }
        }
    }

    handleOffer = async (mSocketID, offer) => {
        const { peerConn } = this.state;
        peerConn.onaddstream = (e) => {
            this.remoteVideo.current.srcObject = e.stream;
        };
        peerConn.onicecandidate = (event) => {
            const cand = event.candidate;
            if (cand) {
                const { userOffer, userIsOffer } = this.state;
                if (userOffer) {
                    socket.emit("candidate", { "mSocketID": userOffer.mSocketID, "candidate": cand });
                } else if (userIsOffer) {
                    socket.emit("candidate", { "mSocketID": userIsOffer.mSocketID, "candidate": cand });
                }
            }
        };

        peerConn.onconnectionstatechange = async (event) => {
            if (peerConn.connectionState === "disconnected") {
                const { localStream } = this.state;
                if (localStream) {
                    localStream.getAudioTracks()[0].stop();
                    localStream.getVideoTracks()[0].stop();
                }
                peerConn.removeStream(localStream);
                peerConn.close();
                this.localVideo.current.srcObject = null;
                this.remoteVideo.current.srcObject = null;
                this.setState({ userOffer: null, userIsOffer: null, isAccepted: false, localStream: null, peerConn: null });
            }
        }
        peerConn.setRemoteDescription(new RTCSessionDescription(offer));
        const newLocalStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        this.localVideo.current.srcObject = newLocalStream;
        peerConn.addStream(newLocalStream);
        peerConn.createAnswer((answer) => {
            peerConn.setLocalDescription(answer);
            socket.emit("answer", { mSocketID, answer });

        }, function (error) {
            console.log("error when create an answer");
        });
        this.setState({ localStream: newLocalStream });
    }

    handleAnswer = (mSocketID, answer) => {
        const { peerConn } = this.state;
        peerConn.setRemoteDescription(new RTCSessionDescription(answer));
    }

    handleCandidate = (mSocketID, candidate) => {
        const { peerConn } = this.state;
        peerConn.addIceCandidate(new RTCIceCandidate(candidate)).catch(error => {
            console.log(error);
        });
    }

    showModal = location => this.setState({ modalVisible: true, lastLocation: location });

    closeModal = (callback = () => { }) => this.setState({ modalVisible: false }, callback);

    handleBlockedNavigation = nextLocation => {
        const { confirmedNavigation } = this.state;
        if (!confirmedNavigation) {
            this.showModal(nextLocation);
            return false;
        }
        return true;
    };

    handleConfirmNavigationClick = () => {
        const { isAccepted, userOffer, userIsOffer, localStream, peerConn } = this.state;
        if (userIsOffer || userOffer) {
            if (!isAccepted) {
                if (userIsOffer) {
                    this.outgoingCallingBell.pause();
                    socket.emit("cancel-offer-a-call", { "receiver": userIsOffer });
                } else if (userOffer) {
                    this.ringtone.pause();
                    socket.emit("answer-offer-a-call", { "receiver": userOffer, "content": { "accept": false, "message": "từ chối cuộc gọi" } });
                }
                this.setState({ userOffer: null, userIsOffer: null });
            } else {
                if (localStream) {
                    localStream.getAudioTracks()[0].stop();
                    localStream.getVideoTracks()[0].stop();
                }
                if (peerConn) {
                    peerConn.removeStream(localStream)
                    peerConn.close();
                }
                this.localVideo.current.srcObject = null;
                this.remoteVideo.current.srcObject = null;
                this.setState({ userOffer: null, userIsOffer: null, isAccepted: false, localStream: null, peerConn: null });
            }
        }
        socket.emit("leave-chat");
        this.closeModal(() => {
            const { lastLocation } = this.state;
            if (lastLocation) {
                this.setState({ confirmedNavigation: true },
                    () => history.push(lastLocation.pathname)
                );
            }
        });
    }

    handleChangeTabMobileChat = (key) => {
        this.setState({ activeKeyTabMobileChat: key })
    }

    onChange = activeKey => {
        this.setState({ activeKeyTabMobileChat: activeKey })
    }

    render() {
        const {
            message, activeTab, activeKeyTabMobileChat, userOffer, isAccepted, userIsOffer,
            familyGroup, modalVisible, receiverActive, receiverRecent, userIsEnteringGroup,
            filteredUsersActive, filteredUsersRecent, userIsEnteringSingle, searchInput,
        } = this.state;
        const { user } = this.props;
        const toolBar = () => (
            <div ref={this.toggleContainer}>
                <Row className="tool-bar-container" >
                    <Col xs={8} sm={8} lg={7} xl={7} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {activeTab === "active" &&
                            <i onClick={this.handleOfferCall} style={{ cursor: "pointer" }} className="fa fa-camera fa-lg" />
                        }
                        &ensp;
                        <i className="fa fa-microphone fa-lg" ></i> &ensp;
                        <i className="fa fa-image fa-lg"></i> &ensp;
                    </Col>
                    <Col xs={16} sm={16} lg={17} xl={17}>
                        <Input
                            name="message"
                            value={message}
                            onBlur={this.handleOnBlur}
                            style={{ borderRadius: 5 }}
                            onChange={this.handleChange}
                            onFocus={this.handleOnFocus}
                            placeholder="Nhập tin nhắn..."
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
            </div>
        );

        const showToolBar = () => (
            (activeTab === "active" && receiverActive)
            ||
            (activeTab === "recent" && receiverRecent)
            ||
            (activeTab === "family" && receiverRecent)
        ) && toolBar();

        const headerBodyMessage = () => {
            if (activeTab === "active") {
                if (receiverActive) {
                    return (
                        <>
                            <Avatar
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
                            <Avatar
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
                            <Avatar className="img-header-message" src={familyGroup.fImage} /> &emsp;
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
                <Prompt when={true} message={this.handleBlockedNavigation} />
                <Modal
                    title={null} footer={null} width={300}
                    visible={modalVisible} closable={false}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <ExclamationCircleOutlined style={{ color: '#fab324', fontSize: 20 }} />
                        &nbsp;
                        {!userIsOffer && !userOffer
                            ? <div style={{ fontSize: 15, fontWeight: 'bold' }}>Bạn muốn rời khỏi?</div>
                            : <div style={{ fontSize: 15, fontWeight: 'bold' }}>Bạn muốn rời khỏi và kết thúc cuộc gọi hiện tại?</div>
                        }
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => this.closeModal(() => { })}>Đóng</Button>
                    &ensp;
                    <Button onClick={this.handleConfirmNavigationClick} type="primary">Đồng ý</Button>
                    </div>
                </Modal>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="header-container chat__header" >
                        <div className="left-header-chat-container">
                            <div onClick={this.handleClickBack} className="header__btn-link">
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                        </div>
                        <div className="center-header-chat-container"> Tin Nhắn </div>

                    </Header>
                    <Content className="chat__content" >
                        <Row className="chat-container">
                            <Col xl={6} lg={10} sm={10} >
                                <Row className="header-chat-list-container">
                                    <Avatar
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
                                        style={{ borderRadius: 5 }} placeholder="Tìm kiếm"
                                    />
                                </Row>
                                <Row style={{ padding: 10 }} >
                                    <Tabs defaultActiveKey={activeTab} onTabClick={this.handleTabClick} style={{ width: "100%" }}>

                                        <TabPane tab="Hoạt động" key="active">
                                            {receiverActive &&
                                                <Menu
                                                    style={{ borderRight: "none" }}
                                                    onClick={this.handleClickMenuActive}
                                                    selectedKeys={[receiverActive.mSocketID]}
                                                >
                                                    {filteredUsersActive.length !== 0 && filteredUsersActive.map((item, index) =>
                                                        <Menu.Item className="menu-item-container" key={item.mSocketID}>
                                                            <Row align="middle" justify="start">
                                                                <div className="img-chat-list-container">
                                                                    <Avatar
                                                                        src={item.mAvatar.image}
                                                                        className="img-chat-list"
                                                                        style={{ backgroundColor: item.mAvatar.color }}
                                                                    />
                                                                    <div className="icon-active" />
                                                                </div>
                                                                <div style={{ float: "right", marginLeft: 10 }} >
                                                                    <div className="name-item-chat-list">{item.mName}</div>
                                                                    {item.messages.length !== 0
                                                                        ? user.mName === item.messages[item.messages.length - 1].name
                                                                            ? <div className="message-under-name-chat-list"> You: {item.messages[item.messages.length - 1].message} </div>
                                                                            : item.messages[item.messages.length - 1].seen
                                                                                ? <div className="message-under-name-chat-list"> {item.messages[item.messages.length - 1].message} </div>
                                                                                : <div className="message-under-name-chat-list" style={{ fontWeight: "bold" }} > {item.messages[item.messages.length - 1].message} </div>
                                                                        : null
                                                                    }
                                                                </div>
                                                            </Row>
                                                        </Menu.Item>
                                                    )}
                                                </Menu>
                                            }
                                        </TabPane>

                                        <TabPane tab="Gần đây" key="recent">
                                            {receiverRecent &&
                                                <Menu
                                                    style={{ borderRight: "none" }}
                                                    onClick={this.handleClickMenuRecent}
                                                    selectedKeys={[receiverRecent.mID]}
                                                >
                                                    {filteredUsersRecent && filteredUsersRecent.map((item, index) =>
                                                        <Menu.Item className="menu-item-container" key={item.mID}>
                                                            <Row align="middle" justify="start">
                                                                <div className="img-chat-list-container">
                                                                    <Avatar
                                                                        src={item.mAvatar.image}
                                                                        className="img-chat-list"
                                                                        style={{ backgroundColor: item.mAvatar.color }}
                                                                    />
                                                                    {item.mSocketID && <div className="icon-active" />}
                                                                </div>
                                                                <div style={{ float: "right", marginLeft: 10 }} >
                                                                    <div className="name-item-chat-list">{item.mName}</div>
                                                                    {item.messages.length !== 0
                                                                        ? user.mName === item.messages[item.messages.length - 1].name
                                                                            ? <div className="message-under-name-chat-list"> You: {item.messages[item.messages.length - 1].message} </div>
                                                                            : item.messages[item.messages.length - 1].seen
                                                                                ? <div className="message-under-name-chat-list"> {item.messages[item.messages.length - 1].message} </div>
                                                                                : <div className="message-under-name-chat-list" style={{ fontWeight: "bold" }} > {item.messages[item.messages.length - 1].message} </div>
                                                                        : null
                                                                    }
                                                                </div>
                                                            </Row>
                                                        </Menu.Item>
                                                    )}
                                                </Menu>
                                            }
                                        </TabPane>

                                        <TabPane tab="Gia đình" key="family-group">
                                            {familyGroup &&
                                                <Menu style={{ borderRight: "none" }} selectedKeys={["group"]}>
                                                    <Menu.Item className="menu-item-container" key="group">
                                                        <Row align="middle" justify="start">
                                                            <div className="img-chat-list-container">
                                                                <Avatar className="img-chat-list" src={familyGroup.fImage} />
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
                            <Col xl={10} lg={14} sm={14} className="chat__show-chat-msg">
                                <Row className="header-message-container"> {headerBodyMessage()} </Row>
                                <Row > {showMessages()} </Row>
                                {showToolBar()}
                            </Col>
                            <Col xl={8} lg={0} sm={0} style={{ padding: 10 }} >

                                <div className="video-call-title"> Video Call </div>

                                <video ref={this.remoteVideo} id="remote-video" autoPlay controls />
                                <video ref={this.localVideo} id="local-video" autoPlay controls />

                                {userOffer && <div className="caller-name"> {`${userOffer.mName} contacting...`} </div>}

                                {userIsOffer && <div className="callee-name"> {`${userIsOffer.mName} contacting...`} </div>}

                                <Row justify="center" >
                                    {userOffer && !isAccepted &&
                                        <Button onClick={this.handleAccept} className="accept-btn green-btn color-btn">
                                            <FontAwesomeIcon icon={faPhone} size="lg" />
                                        </Button>
                                    }
                                    &emsp;&emsp;&emsp;
                                    {(userIsOffer || userOffer) &&
                                        <Button onClick={this.handleClose} className="cancel-btn red-btn color-btn">
                                            <FontAwesomeIcon icon={faPhoneSlash} size="lg" />
                                        </Button>
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </Content>

                    <Content className="chat-mobile__content">
                        <Tabs type="card" defaultActiveKey={activeKeyTabMobileChat} activeKey={activeKeyTabMobileChat} onChange={this.onChange}>
                            <TabPane tab="Thành viên" key="members">
                                <div >
                                    <Row className="header-chat-list-container">
                                        <Avatar
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
                                            style={{ borderRadius: 5 }} placeholder="Tìm kiếm"
                                        />
                                    </Row>
                                    <Row style={{ padding: 10 }} >
                                        <Tabs defaultActiveKey={activeTab} onTabClick={this.handleTabClick} style={{ width: "100%" }}>

                                            <TabPane tab="Hoạt động" key="active">
                                                {receiverActive &&
                                                    <Menu
                                                        style={{ borderRight: "none" }}
                                                        onClick={this.handleClickMenuActive}
                                                        selectedKeys={[receiverActive.mSocketID]}
                                                    >
                                                        {filteredUsersActive.length !== 0 && filteredUsersActive.map((item, index) =>
                                                            <Menu.Item className="menu-item-container" key={item.mSocketID}>
                                                                <Row align="middle" justify="start">
                                                                    <div className="img-chat-list-container">
                                                                        <Avatar
                                                                            src={item.mAvatar.image}
                                                                            className="img-chat-list"
                                                                            style={{ backgroundColor: item.mAvatar.color }}
                                                                        />
                                                                        <div className="icon-active" />
                                                                    </div>
                                                                    <div style={{ float: "right", marginLeft: 10 }} >
                                                                        <div className="name-item-chat-list">{item.mName}</div>
                                                                        {item.messages.length !== 0
                                                                            ? user.mName === item.messages[item.messages.length - 1].name
                                                                                ? <div className="message-under-name-chat-list"> You: {item.messages[item.messages.length - 1].message} </div>
                                                                                : item.messages[item.messages.length - 1].seen
                                                                                    ? <div className="message-under-name-chat-list"> {item.messages[item.messages.length - 1].message} </div>
                                                                                    : <div className="message-under-name-chat-list" style={{ fontWeight: "bold" }} > {item.messages[item.messages.length - 1].message} </div>
                                                                            : null
                                                                        }
                                                                    </div>
                                                                </Row>
                                                            </Menu.Item>
                                                        )}
                                                    </Menu>
                                                }
                                            </TabPane>

                                            <TabPane tab="Gần đây" key="recent">
                                                {receiverRecent &&
                                                    <Menu
                                                        style={{ borderRight: "none" }}
                                                        onClick={this.handleClickMenuRecent}
                                                        selectedKeys={[receiverRecent.mID]}
                                                    >
                                                        {filteredUsersRecent && filteredUsersRecent.map((item, index) =>
                                                            <Menu.Item className="menu-item-container" key={item.mID}>
                                                                <Row align="middle" justify="start">
                                                                    <div className="img-chat-list-container">
                                                                        <Avatar
                                                                            src={item.mAvatar.image}
                                                                            className="img-chat-list"
                                                                            style={{ backgroundColor: item.mAvatar.color }}
                                                                        />
                                                                        {item.mSocketID && <div className="icon-active" />}
                                                                    </div>
                                                                    <div style={{ float: "right", marginLeft: 10 }} >
                                                                        <div className="name-item-chat-list">{item.mName}</div>
                                                                        {item.messages.length !== 0
                                                                            ? user.mName === item.messages[item.messages.length - 1].name
                                                                                ? <div className="message-under-name-chat-list"> You: {item.messages[item.messages.length - 1].message} </div>
                                                                                : item.messages[item.messages.length - 1].seen
                                                                                    ? <div className="message-under-name-chat-list"> {item.messages[item.messages.length - 1].message} </div>
                                                                                    : <div className="message-under-name-chat-list" style={{ fontWeight: "bold" }} > {item.messages[item.messages.length - 1].message} </div>
                                                                            : null
                                                                        }
                                                                    </div>
                                                                </Row>
                                                            </Menu.Item>
                                                        )}
                                                    </Menu>
                                                }
                                            </TabPane>

                                            <TabPane tab="Gia đình" key="family-group">
                                                {familyGroup &&
                                                    <Menu style={{ borderRight: "none" }} selectedKeys={["group"]}>
                                                        <Menu.Item className="menu-item-container" key="group">
                                                            <Row align="middle" justify="start">
                                                                <div className="img-chat-list-container">
                                                                    <Avatar className="img-chat-list" src={familyGroup.fImage} />
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
                                </div>
                            </TabPane>
                            <TabPane tab="Tin nhắn" key="messages">
                                <Row className="header-message-container"> {headerBodyMessage()} </Row>
                                <Row > {showMessages()} </Row>
                                {showToolBar()}
                            </TabPane>
                            <TabPane tab="Cuộc gọi" key="calls">
                                <div >
                                    <div className="video-call-title"> Video Call </div>
                                    <video ref={this.remoteVideo} id="remote-video" autoPlay controls />
                                    <video ref={this.localVideo} id="local-video" autoPlay controls />
                                    {userOffer && <div className="caller-name"> {`${userOffer.mName} contacting...`} </div>}
                                    {userIsOffer && <div className="callee-name"> {`${userIsOffer.mName} contacting...`} </div>}
                                    <Row justify="center" >
                                        {userOffer && !isAccepted &&
                                            <Button onClick={this.handleAccept} className="accept-btn green-btn color-btn">
                                                <FontAwesomeIcon icon={faPhone} size="lg" />
                                            </Button>
                                        }
                                        &emsp;&emsp;&emsp;
                                        {(userIsOffer || userOffer) &&
                                            <Button onClick={this.handleClose} className="cancel-btn red-btn color-btn">
                                                <FontAwesomeIcon icon={faPhoneSlash} size="lg" />
                                            </Button>
                                        }
                                    </Row>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Content>
                </Layout >
            </Layout >
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.inforLogin.user
})

export default connect(mapStateToProps)(ChatContainer);