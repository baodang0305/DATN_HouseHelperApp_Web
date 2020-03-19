import React from "react";
import { Layout, Row, Col, Button } from "antd";
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
                        <Row>
                            <Col flex="30px"> <Button onClick={this.handleClickBack} className="button-back"> <LeftOutlined /> </Button> </Col>
                            <Col flex="auto"><h2 style={{textAlign: "center"}}>Setting</h2></Col>
                        </Row>
                    </Header>
                    <Content>
                        <div className="panel-container">
                            <span className="panel-content">
                                <i className="fa fa-user-o custom-icon"></i> 
                                My Account
                            </span> 
                            <CaretRightOutlined className="caretright-icon"/> 
                        </div>
                        <div className="panel-container">
                            <span className="panel-content">
                                <i className="fa fa-question-circle-o custom-icon"></i>
                                Helper Center
                            </span> 
                            <CaretRightOutlined className="caretright-icon"/> 
                        </div>
                        <div className="panel-container">
                            <span className="panel-content">
                                <i className="fa fa-commenting-o custom-icon"></i>
                                Feedback
                            </span> 
                            <CaretRightOutlined className="caretright-icon"/> 
                        </div>
                        <div className="panel-container">
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