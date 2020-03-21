import React from "react";
import { Layout, Form, Input, Button, Select, Row, Col, Radio, Upload } from 'antd';
import { LeftOutlined, LockOutlined } from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import cameraImg from "../../assets/camera-img.png";
import profileImg from "../../assets/profile-img.png";
import history from "../../helpers/history";
import "./MyAccount.css";

const { Header, Footer, Content} = Layout;

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarType: "pink"
        }
    }

    handleChange = (e) => {
        this.setState({
            avatarType: e.target.value
        });
    }

    handleClickBack = () => {
        history.goBack();
    }

    render() {
        const { avatarType } = this.state;
        let Avatar;
        switch(avatarType) {
            case "pink": {
                Avatar = () => { return (<img src={profileImg} className="upload-container pink-avatar"/>) };
                break;
            }
            case "yellow": {
                Avatar = () => { return (<img src={profileImg} className="upload-container yellow-avatar"/>) };
                break;
            }
            case "orange": {
                Avatar = () => { return (<img src={profileImg} className="upload-container orange-avatar"/>) };
                break;
            }
            case "purple": {
                Avatar = () => { return (<img src={profileImg} className="upload-container purple-avatar"/>) };
                break;
            }
            case "blue": {
                Avatar = () => { return (<img src={profileImg} className="upload-container blue-avatar"/>) };
                break;
            }
            case "green": {
                Avatar = () => { return (<img src={profileImg} className="upload-container green-avatar"/>) };
                break;
            }
            case "camera": {
                Avatar = () => {
                    return (
                        <Upload>
                            <Button className="upload-container">
                                <div className="camera-icon-container">
                                    <img src={cameraImg} className="camera-img"/>
                                </div> 
                                <div className="name-upload-container">
                                    <div className="name-upload">Add Photo</div>
                                </div>
                            </Button>
                        </Upload>
                    );
                }
                break;
            }
        }

        return (
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0}}>
                        <Row style={{textAlign: "center"}}>
                            <Col flex="30px"> 
                                <Button onClick={this.handleClickBack} style={{marginLeft: "10px"}}> <LeftOutlined className="icon-back"/> </Button> 
                            </Col>                         
                            <Col flex="auto">
                                <div className="title-header">My Account</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content className="site-layout-background content-my-profile-container">
                        <Row justify="center" align="middle" className="my-profile-container">
                            <Col md={6}>
                                <Form name="create-profile"  size="large" initialValues={{ remember: true }}>
                                    <Form.Item style={{textAlign: "center"}}>
                                        <Avatar />
                                    </Form.Item>
                                    <Form.Item>
                                        <Radio.Group onChange={this.handleChange} defaultValue="pink" className="list-avatar-container">
                                            <Radio.Button value="camera" className="avatar camera-avatar"> 
                                                <i className="fa fa-camera camera-icon" aria-hidden="true"></i>
                                            </Radio.Button>
                                            <Radio.Button value="pink" className="avatar pink-avatar"></Radio.Button>
                                            <Radio.Button value="yellow" className="avatar yellow-avatar"></Radio.Button>
                                            <Radio.Button value="orange" className="avatar orange-avatar"></Radio.Button>
                                            <Radio.Button value="purple" className="avatar purple-avatar"></Radio.Button>
                                            <Radio.Button value="blue" className="avatar blue-avatar"></Radio.Button>
                                            <Radio.Button value="green" className="avatar green-avatar"></Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                                        <Input prefix={<i className="fa fa-user" aria-hidden="true"></i>} placeholder="Name"/>
                                    </Form.Item>
                                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]} >
                                        <Input
                                            prefix={<i className="fa fa-envelope" aria-hidden="true"></i>}
                                            type="text"
                                            placeholder="Email"
                                        />
                                    </Form.Item>
                                    <Form.Item name="age" rules={[{ required: true, message: 'Please input your Age!' }]}>
                                        <Input prefix={ <i className="fa fa-birthday-cake" aria-hidden="true"></i> } placeholder="Age"/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Row>
                                            <Col flex="260px">  
                                                <Select defaultValue="father" >
                                                    <Select.Option value="father">father</Select.Option>
                                                    <Select.Option value="father">mother</Select.Option>
                                                </Select>
                                            </Col>
                                            <Col flex="auto" > 
                                                <Radio className="radio-admin"> Admin </Radio> 
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item >
                                        <div style={{fontSize: "18px"}}> <LockOutlined /> Set personal password </div>
                                    </Form.Item>
                                    <Form.Item>
                                        <Input placeholder="current password"/>
                                        <p />
                                        <Input placeholder="new password" />
                                        <p />
                                        <Input placeholder="confirm password" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Row>
                                            <Col span={11}>
                                                <Button className="delete-button" htmlType="submit" >
                                                    Delete
                                                </Button>
                                            </Col>
                                            
                                            <Col span={11} offset={2}>
                                                <Button className="save-button" type="primary" htmlType="submit" >
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                   
                                </Form>
                            </Col>
                        </Row>
                    </Content>
                    
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default MyAccount;