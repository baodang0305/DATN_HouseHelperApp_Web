import React from "react";
import { Layout, Row, Col, Button, Form, Input, Avatar } from "antd";
import { LeftOutlined, TeamOutlined, CheckOutlined, RightOutlined  } from "@ant-design/icons";

import "./AddEvent.css";
import history from "../../../helpers/history";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";

const { Header, Content, Footer } = Layout;

const AddEvent = () => {

    const handleClickBack = () => {
        history.push("/calendar");
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardMenu menuItem="2" />
            <Layout className="site-layout">
                <Header className="site-layout-background" >
                    <Row style={{ width: '100%' }}>
                        <Col span={10} className="header-part-left" >
                            <Button onClick={handleClickBack} style={{ marginLeft: "10px" }} size="large" >
                                <LeftOutlined />
                            </Button>
                        </Col>
                        <Col span={4} className="header-title">Add Event</Col>
                        <Col span={10} className="header-part-right">

                        </Col>
                    </Row>
                </Header>

                <Content >
                    <Form style={{}} size="large">
                        <Form.Item className="name-event-container">
                            <Input className="name-event-input" placeholder="Event name" />
                        </Form.Item>
                        <Form.Item className="asign-event-container">
                            <TeamOutlined className="team-icon-add-event"/>
                            <span className="title-asign-add-event"> Assign </span>
                            <Row align="middle" justify="center" style={{ marginBottom: 20}}>
                                <a href="#1" className="pre-icon-add-event"> <LeftOutlined /> </a>
                                <div className="list-users-asign-add-event-container" >
                                    <div id="1" className="user-add-event-container" >
                                        <div className="avatar-container">
                                            <Avatar size={50} />
                                        </div>
                                        <CheckOutlined className="check-asign-add-event" />
                                        <div>Nguyễn Văn A</div>
                                    </div>
                                    <div id="2" className="user-add-event-container" >
                                        <div className="avatar-container">
                                            <Avatar  size={50} />
                                        </div>
                                        <CheckOutlined className="check-asign-add-event" />
                                        <div>Nguyễn Văn A</div>
                                    </div>
                                    <div id="3" className="user-add-event-container" >
                                        <div className="avatar-container">
                                            <Avatar  size={50} />
                                        </div>
                                        <CheckOutlined className="check-asign-add-event" />
                                        <div>Nguyễn Văn A</div>
                                    </div>
                                    <div id="4" className="user-add-event-container" >
                                        <div className="avatar-container">
                                            <Avatar  size={50} />
                                        </div>
                                        <CheckOutlined className="check-asign-add-event" />
                                        <div>Nguyễn Văn A</div>
                                    </div>
                                    <div id="5" className="user-add-event-container" >
                                        <div className="avatar-container">
                                            <Avatar  size={50} />
                                        </div>
                                        <CheckOutlined className="check-asign-add-event" />
                                        <div>Nguyễn Văn B</div>
                                    </div>

                                </div>
                                <a href="#5" className="next-icon-add-event"> <RightOutlined /> </a>
                            </Row>

                        </Form.Item>
                        <Form.Item style={{ backgroundColor: "white", margin: 10 }}>
                            infor
                        </Form.Item>
                    </Form>
                </Content>
                <Footer style={{ textAlign: 'center' }}></Footer>
            </Layout>
        </Layout>
    )
}

export default AddEvent;