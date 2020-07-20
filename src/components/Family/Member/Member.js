import React from "react";
import moment from 'moment';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, List, Skeleton, Avatar } from "antd";
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
                            <div onClick={this.handleClickBack} className="header__btn-link" >
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                            <div className="center-header-member-container" > {member.mName}</div>
                            <div>
                                {(inforLogin.user.mIsAdmin || (inforLogin.user._id === member._id)) &&
                                    <Link to={{ pathname: "/family/setting/my-account", state: { member } }} className="header__btn-link">
                                        <EditOutlined className="header__icon-btn" />
                                    </Link>
                                }
                            </div>
                        </div>
                    </Header>
                    <Content  >
                        <div className="first-row-member-content-container">
                            <Avatar src={member.mAvatar.image} style={{ backgroundColor: member.mAvatar.color }} size={70} />
                            &emsp;
                            <div >
                                <div className="font-size-20"> {member.mPoints} </div>
                                <div>Points bank</div>
                            </div>
                        </div>
                        <div className="second-row-member-content-container" >
                            <List className="member__list"
                                dataSource={listTasks}
                                pagination={{ pageSize: 5, size: 'small' }}
                                style={{ width: "100%" }} itemLayout="vertical" size="large"
                                renderItem={item => (
                                    <List.Item className="member__list-item"
                                        actions={[
                                            <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="0" key="list-vertical-message" />,
                                        ]}
                                        extra={item.photo && <img className="image-task" alt="logo" src={item.photo} />}
                                    >
                                        <Skeleton avatar title={false} loading={item.loading} active>
                                            <div className="member__news-container" >
                                                <div style={{ textAlign: "center" }} className="member__news-item-member">
                                                    <Avatar src={item.mIdCreate.mAvatar} style={{ marginBottom: 5 }} />
                                                    <div className="member__name">{item.mIdCreate.mName}</div>
                                                </div>
                                                <div className="member__news-item-des">
                                                    <div className="state-task">{item.state === "todo" ? "Cần làm" : (item.state === "completed" ? "Đã xong" : "Sắp tới")}</div>
                                                    <div className="name-task">{item.name}</div>
                                                    {item.date && <div className="date-task">{moment(`${item.date.lastDueDate}`).format('MMMM Do YYYY, h:mm:ss a')}</div>}
                                                </div>
                                            </div>
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    listTasks: state.index.listTasks
})

const actionCreators = {
    getListTasks: indexActions.getListTasks
}

export default connect(mapStateToProps, actionCreators)(Member);