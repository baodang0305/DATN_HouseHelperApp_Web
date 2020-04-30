import {
    PlusOutlined,
    MailOutlined,
    StarOutlined,
    LikeOutlined,
    CloseOutlined,
    SettingOutlined,
    MessageOutlined,
    NotificationOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import React from "react";
import moment from 'moment';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import socketIoClient from "socket.io-client";
import { Layout, List, Avatar, Button, Skeleton, Badge, Spin } from "antd";

import "./Family.css";
import history from "../../helpers/history";
import apiUrlTypes from "../../helpers/apiURL";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { indexActions } from "../../actions/index.actions";
import { familyActions } from "../../actions/family.actions";
import { memberActions } from "../../actions/member.actions";

const { Header, Content, Footer } = Layout;

class Family extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listNews: [],
            listMembers: []
        }
    }

    async componentDidMount() {

        const { getListNews, getListMembers, getNumberOfIncomingMessages, user, token } = this.props;

        getNumberOfIncomingMessages(user);
        await getListNews();
        await getListMembers();

        const { listNews, listMembers } = this.props;
        this.setState({ listNews, listMembers });

        const socket = socketIoClient(apiUrlTypes.heroku);

        socket.on('connect', function () {
            socket.emit('authenticate', { token });
        });

        socket.on("authenticate", (res) => {
            //this.setState({ connect: res.message });
        });

        socket.on("Member", async (data) => {
            if (data.type === "editMember" || data.type === "addMember") {
                await getListMembers();
                const { listMembers } = this.props;
                this.setState({ listMembers });
            }
            if (data.type === "deleteMember") {
                const { listMembers } = this.state;
                let indexMember = listMembers.findIndex(element => element._id === data.mID);
                if (indexMember !== -1) {
                    let newListMembers = [...listMembers];
                    newListMembers.splice(indexMember, 1);
                    this.setState({ listMembers: newListMembers });
                }
            }
        });

        socket.on("Family", data => {
            const { updateInforFamilyOfUser } = this.props;
            if (data.type === "editFamily") {
                updateInforFamilyOfUser();
            }
        });

        socket.on("News", async (data) => {
            if (data.type === "deleteNews") {
                const { getListNews } = this.props;
                await getListNews();
                const { listNews } = this.props;
                this.setState({ listNews });
            }
        });

    }

    handleChooseMember = (member) => {
        history.push({ pathname: "/family/member", search: `?id=${member._id}`, state: { member } });
    }

    handleClickDeleteNew = (item) => {
        const { listNews } = this.state;
        const { deleteNew } = this.props;
        deleteNew({ "nID": item._id });
        let indexNew = listNews.findIndex(element => element._id === item._id);
        if (indexNew !== -1) {
            let newListNews = [...listNews];
            newListNews.splice(indexNew, 1);
            this.setState({ listNews: newListNews });
        }
    }

    render() {

        const {
            user,
            gotListNews,
            gotListMembers,
            gettingListNews,
            gettingListMembers,
            numberOfIncomingMessages,
        } = this.props;

        const { listNews, listMembers } = this.state;

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
                        <div className="header-family-container" >
                            <div>
                                <Button size="large">
                                    <Link to="/family/setting">
                                        <SettingOutlined className="icon-header-family" />
                                    </Link>
                                </Button>
                                &emsp;
                                <Button size="large">
                                    <Link to="/family/chat">
                                        <Badge count={numberOfIncomingMessages}>
                                            <MailOutlined className="icon-header-family" />
                                        </Badge>
                                    </Link>
                                </Button>
                            </div>
                            <div className="center-header-family-container">Gia Đình</div>
                            <div>
                                {user.mIsAdmin &&
                                    <Button size="large">
                                        <Link to="/family/add-member">
                                            <PlusOutlined className="icon-header-family" />
                                        </Link>
                                    </Button>
                                }
                            </div>
                        </div>
                    </Header>

                    <Content >
                        <div className="first-row-family-content-container">
                            <div className="title-first-row-family-content-container">
                                <UsergroupAddOutlined />
                                &ensp;
                                <div className="title-first-row-family-content"> Tất cả thành viên </div>
                            </div>
                            {gettingListMembers && !gotListMembers &&
                                <div className="spin-get-list-members"><Spin tip="Loading..." /> </div>
                            }
                            <div className="list-members-container">
                                {listMembers && listMembers.map((member, id) =>
                                    <div className="member-item-container" key={id} onClick={() => this.handleChooseMember(member)}>
                                        <Badge count={10} overflowCount={10000}>
                                            <Avatar src={member.mAvatar.image} style={{ backgroundColor: member.mAvatar.color }} shape="circle" size={60} />
                                        </Badge>
                                        <div className="size-member-name"> {member.mName} </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="second-row-family-content-container">
                            <div className="title-second-row-family-content-container">
                                <NotificationOutlined />
                                &ensp;
                                <div className="title-second-row-family-content">Bảng tin gia đình</div>
                            </div>
                            {gettingListNews && !gotListNews &&
                                <div className="spin-get-list-news"> <Spin tip="Loading..." /> </div>
                            }
                            {listNews &&
                                <List
                                    style={{ padding: "10px 50px", width: "100%" }}
                                    itemLayout="vertical"
                                    size="large"
                                    pagination={{
                                        onChange: page => {
                                            console.log(page);
                                        },
                                        pageSize: 3,
                                    }}
                                    dataSource={listNews}
                                    renderItem={item => (
                                        <List.Item
                                            actions={[
                                                <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                                                <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                                                <IconText icon={MessageOutlined} text="0" key="list-vertical-message" />,
                                            ]}
                                        >
                                            <Skeleton avatar title={false} loading={item.loading} active>
                                                <div className="list-item-new-family-container" >
                                                    <div className="left-list-item-family-container">
                                                        <div className="first-col-content-list-item-family">
                                                            <Avatar src={item.mID.mAvatar.image} style={{ marginBottom: 5, backgroundColor: item.mID.mAvatar.color }} />
                                                            <div>{item.mID.mName}</div>
                                                        </div>
                                                        <div>
                                                            <div className="state-task">{item.subject}</div>
                                                            <div className="name-task">{item.content}</div>
                                                            {item.date && <div className="date-task">{moment(`${item.date}`).format('MMMM Do YYYY, h:mm:ss a')}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="right-list-item-family-container" onClick={() => this.handleClickDeleteNew(item)}>
                                                        <CloseOutlined />
                                                    </div>
                                                </div>
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            }
                        </div>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    const { inforLogin } = state.authentication;
    const { listTasks, numberOfIncomingMessages } = state.index;
    const { listMembers, gettingListNews, gotListNews, gettingListMembers, gotListMembers, listNews } = state.family;
    return {
        listNews,
        listTasks,
        gotListNews,
        listMembers,
        gotListMembers,
        gettingListNews,
        gettingListMembers,
        user: inforLogin.user,
        token: inforLogin.token,
        numberOfIncomingMessages
    };

}

const actionCreators = {
    deleteNew: memberActions.deleteNew,
    getListNews: familyActions.getListNews,
    getListTasks: indexActions.getListTasks,
    getListMembers: familyActions.getListMembers,
    updateInforFamilyOfUser: memberActions.updateInforFamilyOfUser,
    getNumberOfIncomingMessages: indexActions.getNumberOfIncomingMessages
}
export default connect(mapStateToProps, actionCreators)(Family);