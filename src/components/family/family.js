import React from "react";
import { Layout, Menu, Row, Col, Divider, List, Avatar} from "antd";
import { Link } from "react-router-dom";
import { 
    PlusCircleOutlined , 
    SettingOutlined, 
    MailOutlined,
    StarOutlined,
    LikeOutlined,
    MessageOutlined
} from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import "./Family.css";
import profileImg from "../../assets/profile-img.png";
import familyImg from "../../assets/family-img.png";

const { Header, Content, Footer } = Layout; 

class Family extends React.Component {

    render() {
        const ProfileImg = ({profileImg, point, nameMember}) => (
            <div className="container-img-profile">
                <img src={profileImg} className="profile-img"></img>
                <div className="badge">{point}</div>
                <div className="size-member-name">{nameMember}</div>
            </div>
        );

        const listData = [];
        for (let i = 0; i < 23; i++) {
            listData.push({
                title: `Activity ${i}`,
                // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                description:
                'You need to describe an activity that take place.'
            });
        }

        const IconText = ({ icon, text }) => (
            <span>
              {React.createElement(icon, { style: { marginRight: 8 } })}
              {text}
            </span>
        );

        return(
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="1" familyImg={familyImg}/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        <Menu onClick={this.handleClick} mode="horizontal" className="modified-top-menu">
                            <Menu.Item key="setting">
                                <SettingOutlined className="size-icon"/>
                                <Link to="/setting">Setting </Link>
                            </Menu.Item>
                            <Menu.Item key="message">
                                <MailOutlined className="size-icon"/>
                                <Link to="/family/message"> Message </Link>
                            </Menu.Item>
                            <Menu.Item key="add">
                                <PlusCircleOutlined  className="size-icon"/>
                                <Link to="/family/add-member"> Add </Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content>
                        <Row className="row-modified">
                            <Divider orientation="left" className="divider-modified" style={{ color: '#333', fontWeight: 'normal' }}>
                                All Member
                            </Divider>
                            <Col md={8} className="col-modified">
                                <ProfileImg profileImg={profileImg} point={3} nameMember="Name Member" />
                            </Col>
                            <Col md={8} className="col-modified">
                                <ProfileImg profileImg={profileImg} point={3} nameMember="Name Member" />
                            </Col>
                            <Col md={8} className="col-modified">
                                <ProfileImg profileImg={profileImg} point={3} nameMember="Name Member" />
                            </Col>
                        </Row>

                        <Row className="row-modified">
                            <Divider orientation="left" className="divider-modified" style={{ color: '#333', fontWeight: 'normal' }}>
                                All Activities
                            </Divider>
                            <List
                                className="list-modified"
                                itemLayout="vertical"
                                size="large"
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 3,
                                }}
                                dataSource={listData}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                        ]}
                                        extra={
                                            <img
                                                className="activity-img"
                                                alt="logo"
                                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                            />
                                        }
                                    >
                                        <List.Item.Meta
                                            // avatar={<Avatar src={item.avatar} />}
                                            avatar={<Avatar src={profileImg} />}
                                            title={<div>{item.title}</div>}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Family;