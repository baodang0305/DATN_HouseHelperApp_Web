import React from "react";
import { Layout, Button, Row, Col, Input, Menu, Tooltip } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import history from "../../helpers/history";
import profileImg from "../../assets/profile-img.png";
import "./Message.css";
const { Header, Content, Footer } = Layout;
const { Search } = Input;

class Message extends React.Component {

    handleClickBack = () => {
        history.goBack();
    }

    render() {
        return(
            <Layout style={{minHeight: "100vh"}}>
                <DashboardMenu menuItem="1"/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0}}>
                        <Row style={{textAlign: "center"}}>
                            <Col flex="30px"> 
                                <Button onClick={this.handleClickBack} style={{marginLeft: "10px"}}> <LeftOutlined className="icon-back"/> </Button> 
                            </Col>                         
                            <Col flex="auto">
                                <div className="title-header">Message</div>
                            </Col>
                       </Row>
                    </Header>
                    <Content style={{margin: "15px"}}>
                        <Row className="chat-container site-layout-background">
                            <Col span={6} className="menu-chat-container">
                                <Row className="header-menu-container" >
                                    <img className="avatar-messenger" src={profileImg}/> &ensp; <span className="name-messenger"> Name </span>
                                </Row>
                                <Row className="search-menu-container">
                                    <Search className="search-messenger" placeholder="search messenger" onSearch={value => console.log(value)} />
                                </Row>
                                <Row className="content-menu-container">
                                    <Menu defaultSelectedKeys="Bao" mode="vertical" className="list-partner-container">
                                        <Menu.Item key="Bao" className="partner-item-container">
                                            <Row className="partner-container">
                                                <img className="avatar-partner" src={profileImg}/> &ensp;
                                                <Col >
                                                    <div className="name-partner"> Name partner </div>
                                                    <div className="content-message"> You: love you</div>
                                                </Col>
                                            </Row>
                                        </Menu.Item>
                                        <Menu.Item className="partner-item-container">
                                            <Row className="partner-container">
                                                <img className="avatar-partner" src={profileImg}/> &ensp;
                                                <Col >
                                                    <div className="name-partner"> Name partner </div>
                                                    <div className="content-message"> You: love you</div>
                                                </Col>
                                            </Row>
                                        </Menu.Item>
                                    </Menu>
                                </Row>
                            </Col>
                            <Col span={18} className="body-chat-container">
                                <Row className="header-body-container">
                                    <img className="avatar-partner" src={profileImg}/> &ensp;
                                    <Col >
                                        <div className="name-partner"> Name partner </div>
                                        <div className="content-message"> Active 1h ago</div>
                                    </Col>
                                </Row>
                                <Row className="content-body-container">
                                    <Row>
                                        content
                                    </Row>
                                    <Row className="toolbar-bottom"> 
                                        <Col ><i className="fa fa-camera fa-lg icon-toolbar"></i> </Col> &emsp;
                                        <Col > <i className="fa fa-microphone fa-lg icon-toolbar" ></i> </Col> &emsp;
                                        <Col > <i className="fa fa-image fa-lg icon-toolbar"></i> </Col> &emsp;
                                        <Col flex="auto"> 
                                            <Input 
                                                className="message-input"
                                                placeholder="Type a message..."
                                                suffix={
                                                    <Tooltip title="choose an emoji">
                                                        <i className="fa fa-smile-o fa-lg icon-smile"></i>
                                                    </Tooltip>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Row>
                            </Col>
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Message;