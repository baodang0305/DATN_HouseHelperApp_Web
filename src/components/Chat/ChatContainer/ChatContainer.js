import React from "react";
import { Layout, Row, Col, Button, Input, Menu, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import socketIoClient from "socket.io-client";
import history from "../../../helpers/history";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import Messages from "../Messages/Messages";
import profileImg from "../../../assets/profile-img.png";
import "./ChatContainer.css";

const { Header, Content, Footer } = Layout; 
const { Search } = Input;

let socket;

class ChatContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            message: "",
            messages: [],
            usersActive: []
        }
    }

    handleClickBack = () => {
        history.goBack();
    }

    componentDidMount() {
        socket = socketIoClient("http://localhost:3001");
        socket.on("server-send-message", (message) => {
            this.setState((state) => ({
                messages: [...state.messages, message]
            }));
        });
        socket.on("server-response-message", (message) => {
            this.setState((state) => ({
                messages: [...state.messages, message]
            }));
        });
        socket.on("server-send-list-user-active", (listUserActive) => {
            this.setState({
                usersActive: listUserActive
            });
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleKeyPress = (e) => {
        const { message } = this.state;
        if(message) {
            if(e.key === "Enter") {
                socket.emit("client-send-message", message);
                this.setState({message: ""});
            }
        }
    }

    handleKeyPress1 = (e) => {
        const { name } = this.state;
        if(name) {
            if(e.key === "Enter") {
                socket.emit("join", {name, room: "room1"}, (error) => {
                    if(error) {
                        console.log(error);
                    }
                });
            }
        }
    }

    render() {

        const { messages, name, message, usersActive } = this.state;
        let listUsersActive;
        if (usersActive) {
            listUsersActive = usersActive.map(user =>
                <Menu.Item className="menu-item-container">
                    <Row className="item-chat-list-container"> 
                        <img className="img-item-chat-list" src={profileImg} /> &emsp;
                        <span>
                            <div className="name-item-chat-list">{user.name}</div>
                            <div className="content-item-chat-list">You: How are you?</div>
                        </span>
                    </Row>
                </Menu.Item>
            );
        }

        return (
            <Layout style={{minHeight: "100vh"}}>
                <DashboardMenu menuItem="1"/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}>
                        <Row style={{textAlign: "center"}}>
                            <Col style={{marginLeft: "10px"}}> 
                                <Button onClick={this.handleClickBack}> <LeftOutlined className="icon-back"/> </Button> 
                            </Col>                         
                            <Col flex="auto">
                                <div className="title-header">Message</div>
                            </Col>
                       </Row>
                    </Header>
                    <Content style={{margin: 20}}>
                        <Row className="chat-container">
                            <Col span={8} className="chat-list-container">
                                <Row className="header-chat-list-container">
                                    <img className="img-header-chat-list" src={profileImg} /> &emsp;
                                    <div className="name-header-chat-list">Name</div>
                                </Row>
                                <Row className="search-chat-list-container">
                                    <Search className="search-chat-list" placeholder="search messenger" onSearch={value => console.log(value)} />
                                </Row>
                                <Row className="content-chat-list-container">
                                    <Menu style={{borderRight: "none"}}>
                                        {/* <Menu.Item className="menu-item-container">
                                            <Row className="item-chat-list-container"> 
                                                <img className="img-item-chat-list" src={profileImg} /> &emsp;
                                                <span>
                                                    <div className="name-item-chat-list">Name</div>
                                                    <div className="content-item-chat-list">You: How are you?</div>
                                                </span>
                                            </Row>
                                        </Menu.Item>
                                        <Menu.Item className="menu-item-container">
                                            <Row className="item-chat-list-container"> 
                                                <img className="img-item-chat-list" src={profileImg} /> &emsp;
                                                <span>
                                                    <div className="name-item-chat-list">Name</div>
                                                    <div className="content-item-chat-list">You: How are you?</div>
                                                </span>
                                            </Row>
                                        </Menu.Item> */}
                                        { listUsersActive }
                                    </Menu>
                                </Row>
                            </Col>
                            <Col span={16} className="message-container">
                                <Row className="header-message-container">
                                    <img className="img-header-message" src={profileImg} /> &emsp;
                                    <span>
                                        <div className="name-header-message">Name</div>
                                        <div className="active-container">  <div className="circle-active" /> &nbsp; Active  </div>
                                    </span>
                                </Row>
                                <Row className="content-message-container">
                                    <Messages messages={messages} name={name}/>
                                </Row>
                                <Row className="tool-bar-container">
                                    <Col><i className="fa fa-camera fa-lg"></i> &ensp;
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
                                            onChange = {this.handleChange}
                                            onKeyPress={this.handleKeyPress}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                    <input name="name" value={name} onChange={this.handleChange} onKeyPress={this.handleKeyPress1} />
                </Layout>
            </Layout>
        );
    }
}

export default ChatContainer;