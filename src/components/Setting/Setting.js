import React from "react";
import { Layout, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { LeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import history from "../../helpers/history";
import "./Setting.css";
const { Header, Content, Footer } = Layout;

class Setting extends React.Component {

    handleClickBack = () => {
        history.goBack();
    }

    render(){
        return(
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="1"/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0}}>
                        <Row style={{textAlign: "center"}}>
                            <Col flex="30px"> 
                                <Button onClick={this.handleClickBack} style={{marginLeft: "10px"}}> <LeftOutlined className="icon-back"/> </Button> 
                            </Col>
                            <Col flex="auto">
                                <div className="title-header">Setting</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content >
                        <Link to="/family/setting/my-account">
                            <div className="panel-container">
                                <span className="panel-content">
                                    <i className="fa fa-user-o custom-icon"></i> 
                                    My Account
                                </span> 
                                <CaretRightOutlined className="caretright-icon"/> 
                            </div>
                        </Link>
                        <Link to="#">
                            <div className="panel-container">
                                <span className="panel-content">
                                    <i className="fa fa-question-circle-o custom-icon"></i>
                                    Helper Center
                                </span> 
                                <CaretRightOutlined className="caretright-icon"/> 
                            </div>
                        </Link>
                        <Link to="#">
                            <div className="panel-container">
                                <span className="panel-content">
                                    <i className="fa fa-commenting-o custom-icon"></i>
                                    Feedback
                                </span> 
                                <CaretRightOutlined className="caretright-icon"/> 
                            </div>
                        </Link>
                        <div className="panel-container" onClick={this.handleClickLogout}>
                            <span className="panel-content">
                            <i className="fa fa-sign-out custom-icon" ></i>
                                Log Out
                            </span> 
                            <CaretRightOutlined className="caretright-icon"/> 
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Setting;