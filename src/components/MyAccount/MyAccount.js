import React from "react";
import { Layout, Form, Input, Button, Select, Row, Col, Radio } from 'antd';
import { LeftOutlined, LockOutlined } from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import profileImg from "../../assets/profile-img.png";
import history from "../../helpers/history";
import { indexConstants } from "../../constants/index.constants";
import "./MyAccount.css";

const { Header, Footer, Content} = Layout;

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarType: "pink",
            currentUrlImg: indexConstants.UPLOAD_IMG,
            mAvatar: null
        }
    }

    handleChange = (e) => {
        this.setState({ avatarType: e.target.value });
    }

    handleChangeImg = (e) => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            mAvatar: e.target.files[0]
        });
    }

    handleClickBack = () => {
        history.goBack();
    }

    render() {
        const { avatarType, currentUrlImg } = this.state;
        let Avatar;
        if (avatarType === "camera") {
            Avatar = () => 
                <div className="container-profile-img">
                    <img src={currentUrlImg} className="img-profile" />
                    <input onChange={this.handleChangeImg} type="file" className="input-profile-img"/> 
                </div>
        } else {
            Avatar = () => <img src={profileImg} className={`img-profile ${avatarType}-avatar`} />
        }


        return (
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0}}>
                        <Row style={{textAlign: "center"}}>
                            <Col flex="30px"> 
                                <Button onClick={this.handleClickBack} size="large" style={{marginLeft: "10px"}}> <LeftOutlined /> </Button> 
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
                                                <i className="fa fa-camera camera-icon" aria-hidden="true" /> 
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