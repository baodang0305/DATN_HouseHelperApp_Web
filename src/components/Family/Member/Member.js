import React from "react";
import moment from 'moment';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Button, List, Skeleton, Avatar } from "antd";
import { LeftOutlined, EditOutlined, StarOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";

import "./Member.css";
import history from "../../../helpers/history";
import { indexActions } from "../../../actions/index.actions";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";


const { Header, Content, Footer } = Layout;

class Member extends React.Component {

    handleClickBack = () => {
        history.push("/family");
    }

    componentDidMount() {
        const { getListTasks } = this.props;
        getListTasks();
    }

    render() {

        const { listTasks } = this.props;
        const { member } = history.location.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

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
                    <Header className="header-container" >
                        <div className="header-member-container">
                            <Button onClick={this.handleClickBack} size="large" style={{width: "5%"}}>
                                <LeftOutlined />
                            </Button>
                            <div className="center-header-member-container" > {member.mName}</div>
                            <div style={{width: "5%"}}>
                                {(inforLogin.user.mIsAdmin || (inforLogin.user._id === member._id)) &&
                                    <Button size="large">
                                        <Link to={{ pathname: "/family/setting/my-account", state: { member } }} >
                                            <EditOutlined />
                                        </Link>
                                    </Button>
                                }
                            </div>
                        </div>
                    </Header>
                    <Content  >
                        <div className="first-row-member-content-container">
                            <Avatar src={member.mAvatar.image} style={{ backgroundColor: member.mAvatar.color}} size={70}/>
                            &emsp;
                            <div >
                                <div className="font-size-20"> {member.mPoints} </div>
                                <div>Points bank</div>
                            </div>
                        </div>
                        <div className="second-row-member-content-container" >
                            <List
                                dataSource={listTasks}
                                pagination={{ onChange: page => { console.log(page); }, pageSize: 3, }}
                                style={{ padding: "0px 20px", width: "100%" }} itemLayout="vertical" size="large"
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="0" key="list-vertical-message" />,
                                        ]}
                                        extra={item.photo && <img className="image-task" alt="logo" src={item.photo} />}
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
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    const { listTasks } = state.index;
    return {
        listTasks
    };
}

const actionCreators = {
    getListTasks: indexActions.getListTasks
}

export default connect(mapStateToProps, actionCreators)(Member);