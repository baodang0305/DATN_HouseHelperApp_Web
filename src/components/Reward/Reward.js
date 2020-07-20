import React from "react";
import { connect } from "react-redux";
import socketIoClient from "socket.io-client";
import {
    CaretRightOutlined, CheckOutlined, StarOutlined,
    EditOutlined, EyeOutlined, DeleteOutlined, LoadingOutlined,
} from "@ant-design/icons";
import {
    Layout, Input, Avatar, Collapse, Empty, List, Spin, Tooltip, Button, Tabs
} from "antd";
import moment from 'moment';
import "./Reward.css";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { rewardActions } from "../../actions/reward.actions";
import history from "../../helpers/history";
import HeaderMain from "../Common/HeaderMain/HeaderMain";
import apiUrlTypes from "../../helpers/apiURL";
import Loading from "../Common/Loading/Loading";

let socket;
const { Search } = Input;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

class Reward extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claims: [],
            rewardItemSelected: null,
            showActionReward: false,
        }
    }

    componentDidMount() {

        const { getListRewards, getListHistoryReward } = this.props;
        getListRewards();
        getListHistoryReward();

        socket = socketIoClient(apiUrlTypes.heroku);

        socket.on("connect", () => {
            const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
            socket.emit("authenticate", { "token": inforLogin.token });
        });

        socket.on("Reward", data => {
            const { getListRewards } = this.props;
            (
                data.type === "addReward" ||
                data.type === "editReward" ||
                data.type === "deleteReward" ||
                data.type === "followReward"
            ) && getListRewards();
            (
                data.type === "claimReward" ||
                data.type === "resetHistoryReward"
            ) && getListHistoryReward();
        })
    }

    componentWillUnmount() {
        socket && socket.connected && socket.close();
    }

    handleClaimReward = async (reward) => {
        const { claimReward } = this.props;
        await claimReward({ reward });
        const { claimed } = this.props;
        if (claimed) {
            let { claims } = this.state;
            const indexReward = claims.findIndex(item => item === reward._id);
            if (indexReward === -1) {
                claims = [...claims, reward._id];
                this.setState({ claims })
            }
        }
    }

    handleDeleteReward = (reward) => {
        const { deleteReward } = this.props;
        deleteReward({ rID: reward._id });
    }

    handleFollowReward = (reward) => {
        const { followReward } = this.props;
        followReward({ rID: reward._id });
    }

    handleDeleteAllRewardsReceived = () => {
        const { deleteAllRewardsReceived } = this.props;
        deleteAllRewardsReceived();
    }

    render() {

        const { claims, showActionReward, rewardItemSelected } = this.state;
        const {
            gettingListRewards, gotListRewards, listRewards, inforLogin, claimingReward,
            claimedReward, listHistoryReward, gettingListHistoryReward, gotListHistoryReward,
            deletingReward, deletedReward, deletingAllRewardsReceived, deletedAllRewardsReceived,
        } = this.props;

        const renderSpin = () => (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>
                <Spin tip="Đang xử lí..." />
            </div>
        )

        const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="4" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <HeaderMain tab="reward" title="Phần thưởng" />
                    </Header>
                    <Content style={{ height: '100%' }}>
                        <div className="first-row-reward-content-container">
                            <Avatar
                                src={inforLogin.user ? inforLogin.user.mAvatar.image : ""}
                                style={{ backgroundColor: inforLogin.user && inforLogin.user.mAvatar.color }} size={60}
                            />
                            &emsp;
                            <div >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 'bold' }}> {inforLogin.user ? inforLogin.user.mPoints : 0} </div>
                                    &nbsp;
                                    <div>điểm</div>
                                </div>
                                <div>{inforLogin.user && inforLogin.user.mName}</div>
                            </div>
                        </div>


                        <Tabs defaultActiveKey="reward" className="second-row-reward-content-container" style={{ height: '100%' }}>
                            <TabPane tab="Phần thưởng" key="reward">
                                {(gettingListRewards && !gotListRewards)
                                    ? renderSpin()
                                    : (listRewards && listRewards.length > 0)
                                        ? <List
                                            pagination={{ pageSize: 5, size: 'small' }}
                                            dataSource={listRewards}
                                            renderItem={item => (
                                                <List.Item className="reward-item-container">
                                                    {(
                                                        claimingReward &&
                                                        !claimedReward &&
                                                        item._id === rewardItemSelected._id
                                                    )
                                                        ? <Spin indicator={antIcon} />
                                                        : < div
                                                            onClick={() => { this.handleClaimReward(item), this.setState({ rewardItemSelected: item }) }}
                                                            className="left-reward-item-container"
                                                            style={{
                                                                backgroundColor: claims && claims.findIndex(element => element === item._id) !== -1 ? "#52c41a" : null
                                                            }}
                                                        />
                                                    }

                                                    {claims && claims.findIndex(element => element === item._id) !== -1 &&
                                                        <CheckOutlined
                                                            onClick={() => this.handleClaimReward(item)}
                                                            className="check-icon-left-reward-item"
                                                            style={{ color: "white" }}
                                                        />
                                                    }
                                                    <div
                                                        className="right-reward-item-container"
                                                        onClick={() => this.setState({ showActionReward: !showActionReward, rewardItemSelected: item })}
                                                    >
                                                        <div className="name-reward-item">{item.name}</div>
                                                        <div className="assigns-reward-container">
                                                            {item.assign && item.assign.length > 0 &&
                                                                item.assign.map((member, index) => (
                                                                    <Tooltip placement="topLeft" title={member.mName} key={index}>
                                                                        <Avatar className="reward__avatar"
                                                                            src={member.mAvatar.image}
                                                                            style={{ backgroundColor: member.mAvatar.color, marginRight: 5 }}
                                                                        />
                                                                    </Tooltip>
                                                                ))
                                                            }
                                                            {item.followers && item.followers.length > 0 &&
                                                                item.followers.map((member, index) => (
                                                                    <Tooltip placement="topLeft" title={member.mName} key={index}>
                                                                        <Avatar className="reward__avatar"
                                                                            src={member.mAvatar.image}
                                                                            style={{ backgroundColor: member.mAvatar.color, marginRight: 5 }}
                                                                        />
                                                                    </Tooltip>
                                                                ))
                                                            }
                                                        </div>
                                                        <div className="flex-row-reward">
                                                            <div className="reward__point">
                                                                <StarOutlined className="icon-star-reward" /> {item.points} điểm
                                                                </div>
                                                            {showActionReward && item._id === rewardItemSelected._id &&
                                                                <div className="action-reward-container">
                                                                    {
                                                                        (
                                                                            (!item.assign || (item.assign && item.assign.findIndex(element => element._id === inforLogin.user._id) === -1)) &&
                                                                            (!item.followers || (item.followers && item.followers.findIndex(element => element._id === inforLogin.user._id) === -1))
                                                                        ) &&
                                                                        <div
                                                                            className="action-reward-item"
                                                                            onClick={() => this.handleFollowReward(item)}
                                                                        >
                                                                            <EyeOutlined className="icon-action-reward" />
                                                                            <div>Theo dõi</div>
                                                                        </div>
                                                                    }
                                                                    <div
                                                                        className="action-reward-item green-color-reward"
                                                                        onClick={() => history.push({ pathname: "/rewards/edit-reward", search: `?id=${item._id}`, state: { reward: item } })}
                                                                    >
                                                                        <EditOutlined style={{ color: '#08979c' }} className="icon-action-reward" />
                                                                        <div style={{ color: '#08979c' }} >Sửa</div>
                                                                    </div>
                                                                    <div
                                                                        className="action-reward-item red-color-reward"
                                                                        onClick={() => this.handleDeleteReward(item)}
                                                                    >
                                                                        <DeleteOutlined className="icon-action-reward" />
                                                                        <div >Xóa</div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {deletingReward && !deletedReward && rewardItemSelected._id === item._id && <Loading />}
                                                </List.Item>
                                            )}
                                        />
                                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                            </TabPane>
                            <TabPane tab="Đã nhận" key="achieved">
                                {(gettingListHistoryReward && !gotListHistoryReward)
                                    ? renderSpin()
                                    : (listHistoryReward && listHistoryReward.length > 0)
                                        ? <List
                                            pagination={{ pageSize: 5, size: 'small' }}
                                            dataSource={listHistoryReward}
                                            renderItem={item => (
                                                <List.Item >
                                                    <div className="reward-item-container" style={{ justifyContent: 'space-between' }}>
                                                        <div className="reward__achieved-info">
                                                            <div className="name-reward-item-received">{item.name}</div>
                                                            <div style={{ color: '#daa520' }}>Lúc: {moment(item.date).format('llll')}</div>
                                                        </div>
                                                        <div className="assigns-reward-container">
                                                            {item.assign && item.assign.length > 0 &&
                                                                item.assign.map((member, index) => (
                                                                    <Tooltip placement="topLeft" title={member.mName} key={index}>
                                                                        <Avatar
                                                                            src={member.mAvatar.image} size={40}
                                                                            style={{ backgroundColor: member.mAvatar.color, marginRight: 5 }}
                                                                        />
                                                                    </Tooltip>
                                                                ))
                                                            }
                                                        </div>
                                                        <div className="reward__point"> <StarOutlined className="icon-star-reward" /> {item.points} điểm</div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        >
                                            <div className="all-delete-button-history-reward">
                                                <Button onClick={this.handleDeleteAllRewardsReceived} icon={<DeleteOutlined />} danger>Xóa Tất Cả</Button>
                                            </div>
                                        </List>
                                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                            </TabPane>
                        </Tabs>

                        {/* <Collapse accordion bordered={false} className="second-row-reward-content-container" defaultActiveKey={["1"]}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        >
                            <Panel key="1"
                                header={
                                    <div className="header-panel-reward">
                                        <div>PHẦN THƯỞNG</div>
                                        {listRewards && <Avatar size="small" className="number-of-reward">{listRewards.length}</Avatar>}
                                    </div>
                                }
                                style={{ padding: 10 }}
                            >

                            </Panel>
                            <Panel key="2"
                                header={
                                    <div className="header-panel-reward">
                                        <div>ĐÃ NHẬN</div>
                                        {listHistoryReward && <Avatar size="small" className="number-of-reward">{listHistoryReward.length}</Avatar>}
                                    </div>
                                }
                                style={{ padding: 10 }}
                            >

                            </Panel>
                        </Collapse> */}
                    </Content>
                </Layout>
            </Layout >
        )
    }
}

const mapStateToProps = (state) => ({
    gettingListRewards: state.reward.gettingListRewards,
    gotListRewards: state.reward.gotListRewards,
    listRewards: state.reward.listRewards,
    inforLogin: state.authentication.inforLogin,
    claimingReward: state.reward.claimingReward,
    claimedReward: state.reward.claimedReward,
    claimed: state.reward.claimed,
    listHistoryReward: state.reward.listHistoryReward,
    gettingListHistoryReward: state.reward.gettingListHistoryReward,
    gotListHistoryReward: state.reward.gotListHistoryReward,
    deletingReward: state.reward.deletingReward,
    deletedReward: state.reward.deletedReward,
    followingReward: state.reward.followingReward,
    followedReward: state.reward.followedReward,
    deletingAllRewardsReceived: state.reward.deletingAllRewardsReceived,
    deletedAllRewardsReceived: state.reward.deletedAllRewardsReceived,
});

const actionCreators = {
    getListRewards: rewardActions.getListRewards,
    claimReward: rewardActions.claimReward,
    getListHistoryReward: rewardActions.getListHistoryReward,
    deleteReward: rewardActions.deleteReward,
    followReward: rewardActions.followReward,
    deleteAllRewardsReceived: rewardActions.deleteAllRewardsReceived
}

export default connect(mapStateToProps, actionCreators)(Reward);
