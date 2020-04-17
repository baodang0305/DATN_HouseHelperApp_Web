import React from "react";
import moment from 'moment';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Divider, List, Avatar, Button, Skeleton, Badge } from "antd";
import { PlusOutlined, SettingOutlined, MailOutlined, StarOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";

import "./Family.css";
import history from "../../helpers/history";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { indexActions } from "../../actions/index.actions";
import { familyActions } from "../../actions/family.actions";

const { Header, Content, Footer } = Layout;

class Family extends React.Component {

    componentDidMount() {

        const { getAllMembers, getListTasks, getNumberOfIncomingMessages, user } = this.props;
        getListTasks();
        getAllMembers();
        getNumberOfIncomingMessages(user);

    }

    handleChooseMember = (member) => {
        history.push({ pathname: "/family/member", search: `?id=${member._id}`, state: { member } });
    }

    render() {

        const { user, members, listTasks, numberOfIncomingMessages } = this.props;
        const IconText = ({ icon, text }) => (
            <span>
                {React.createElement(icon, { style: { marginRight: 8 } })}
                {text}
            </span>
        );

        return (

            <Layout style={{ minHeight: '100vh' }}>

                <DashboardMenu menuItem="1" />

                <Layout className="site-layout">

                    <Header className="site-layout-background" >

                        <Row style={{ width: '100%' }}>
                            <Col span={10} className="header-part-left" >
                                <Button style={{ marginRight: 10 }} size="large">
                                    <Link to="/family/setting"> <SettingOutlined className="size-icon" /> </Link>
                                </Button>
                                <Button size="large">
                                    <Link to="/family/chat">
                                        <Badge count={numberOfIncomingMessages}>
                                            <MailOutlined className="size-icon" /> 
                                        </Badge>
                                    </Link>
                                </Button>
                            </Col>
                            <Col span={4} className="header-title">Family</Col>
                            <Col span={10} className="header-part-right">
                                {user.mIsAdmin &&
                                    <Button style={{ marginRight: 10 }} size="large">
                                        <Link to="/family/add-member"> <PlusOutlined className="size-icon" /> </Link>
                                    </Button>
                                }
                            </Col>
                        </Row>

                    </Header>

                    <Content style={{ padding: 30 }}>

                        <Row style={{ backgroundColor: "white", marginBottom: 20, padding: "0px 20px" }} >
                            <Divider orientation="left" style={{ marginBottom: 10 }} > All Member </Divider>
                            {members && members.map((member, id) =>
                                <Col style={{ marginBottom: 40 }} md={6} key={id}>
                                    <div className="container-member" style={{ margin: "auto" }} onClick={() => this.handleChooseMember(member)}>
                                        {member.mAvatar &&
                                            <img src={member.mAvatar.image} className="img-member" style={{ backgroundColor: member.mAvatar.color }} />
                                        }
                                        <div className="badge">{member.mPoints}</div>
                                        <div className="size-member-name">{member.mName}</div>
                                    </div>
                                </Col>
                            )}
                        </Row>

                        <Row style={{ backgroundColor: "white", padding: "0px 20px 20px 20px" }}>
                            <Divider orientation="left"> All Activities </Divider>
                            <List
                                style={{ padding: "0px 50px", width: "100%" }}
                                itemLayout="vertical"
                                size="large"
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 3,
                                }}
                                dataSource={listTasks}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="0" key="list-vertical-message" />,
                                        ]}
                                        extra={
                                            item.photo &&
                                            <img
                                                className="image-task"
                                                alt="logo"
                                                src={item.photo}
                                            />
                                        }
                                    >
                                        <Skeleton avatar title={false} loading={item.loading} active>
                                            <Row gutter={30} >
                                                <Col style={{ textAlign: "center" }}>
                                                    <Avatar src={item.mIdCreate.mAvatar} style={{ marginBottom: 5 }} />
                                                    <div>{item.mIdCreate.mName}</div>
                                                </Col>
                                                <Col>
                                                    <div className="state-task">{item.state}</div>
                                                    <div className="name-task">{item.name}</div>
                                                    {item.date && <div className="date-task">{moment(`${item.date.lastDueDate}`).format('MMMM Do YYYY, h:mm:ss a')}</div>}
                                                </Col>
                                            </Row>
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                        </Row>

                    </Content>

                    <Footer style={{ textAlign: 'center' }}></Footer>

                </Layout>

            </Layout>

        );

    }
}

const mapStateToProps = (state) => {

    const { members } = state.family;
    const { inforLogin } = state.authentication;
    const { listTasks, numberOfIncomingMessages } = state.index;

    return {
        members,
        listTasks,
        user: inforLogin.user,
        numberOfIncomingMessages
    };

}

const actionCreators = {

    getListTasks: indexActions.getListTasks,
    getAllMembers: familyActions.getAllMembers,
    getNumberOfIncomingMessages: indexActions.getNumberOfIncomingMessages
    
}
export default connect(mapStateToProps, actionCreators)(Family);