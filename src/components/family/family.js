import React from "react";
import { Layout, Menu} from "antd";
import { PlusCircleOutlined , SettingOutlined, MailOutlined } from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import "./Family.css";
import profileImg from "../../assets/profile-img.png";
const { Header, Content, Footer } = Layout; 

class Family extends React.Component {

    render() {
        return(
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="1"/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {/* <Row>
                            <Col span={12}>
                                <Link> <SettingOutlined className="icon" style={{ fontSize:"20px", marginLeft: 15 }}/> </Link>
                                <Link> <MessageOutlined className="icon" style={{ fontSize:"20px", marginLeft: 5 }}/> </Link>
                            </Col>
                            <Col span={12}>
                                <Link style={{float: "right"}}> <PlusOutlined className="icon" style={{ fontSize:"20px", marginRight: 15}}/> </Link>
                            </Col>
                        </Row> */}
                        <Menu onClick={this.handleClick} mode="horizontal" className="modified-top-menu">
                            <Menu.Item key="app">
                                <SettingOutlined style={{fontSize: 18}}/>
                                Setting
                            </Menu.Item>
                            <Menu.Item key="mail">
                                <MailOutlined style={{fontSize: 18}}/>
                                Message
                            </Menu.Item>
                            <Menu.Item key="add">
                                <PlusCircleOutlined  style={{fontSize: 18}}/>
                                Add
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ margin: '16px 16px' }}>
                        <div className="container-img-profile">
                            <img src={profileImg} className="profile-img"></img>
                            <div className="badge">3</div>
                        </div>
                        <div className="container-img-profile">
                            <img src={profileImg} className="profile-img"></img>
                            <div className="badge">3</div>
                        </div>
                        <div className="container-img-profile">
                            <img src={profileImg} className="profile-img"></img>
                            <div className="badge">3</div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Family;