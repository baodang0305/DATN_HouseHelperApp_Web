import React from "react";
import {Layout, Breadcrumb, Row, Col} from "antd";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
const { Header, Content, Footer } = Layout; 

class Task extends React.Component {
   
    render() {
        return(
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="3"/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        <Row>
                            <Col span={8}>Task</Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            Bill is a cat.
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Task;