import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import socketIoClient from "socket.io-client";
import { PlusOutlined, HomeOutlined, BellOutlined, CheckOutlined } from "@ant-design/icons";
import { Layout, Button, Input, Tabs, Avatar } from "antd";

import "./Reward.css";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import HeaderMain from "../Common/HeaderMain/HeaderMain";

// let socket;
const { Search } = Input;
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;

class Reward extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1
        }

        this.tabRef = React.createRef();
    }

    componentDidMount() {

        // socket = socketIoClient(apiUrlTypes.heroku);

        // socket.on("connect", () => {
        //     const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        //     socket.emit("authenticate", { "token": inforLogin.token });
        // });

    }

    componentWillUnmount() {
        // socket && socket.connected && socket.close();
    }

    handleClickTabOne = () => {
        const wrapper = this.tabRef.current;
        wrapper.classList.toggle('is-nav-open')
    }

    render() {

        const { activeTab } = this.state;

        const renderContentTabOne = () => {
            return (
                <div className="body-tab-one">
                    <div className="reward-item-container">
                        <div className="left-reward-item-container">
                            <Avatar icon={<CheckOutlined />} size={40} />
                            &emsp; <div className="name-reward-item">Name</div>
                        </div>
                        <div className="right-reward-item-container">
                            <div className="assign-container">
                                <Avatar size={30} />
                                &nbsp; <Avatar size={30} />
                            </div>
                            <div>25 điểm</div>
                        </div>

                    </div>
                    <div className="reward-item-container">
                        <div className="left-reward-item-container">
                            <Avatar icon={<CheckOutlined />} size={40} />
                            &emsp; <div className="name-reward-item">Name</div>
                        </div>
                        <div className="right-reward-item-container">
                            <div className="assign-container">
                                <Avatar size={30} />
                                &nbsp; <Avatar size={30} />
                            </div>
                            <div>25 điểm</div>
                        </div>

                    </div>
                </div>
            )
        }

        const renderContentTabTwo = () => {
            return (
                <div className="body-tab-two">
                    tab two
                </div>
            )
        }

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="4" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <HeaderMain tab="reward" title="Phần thưởng" />
                    </Header>

                    <Content className="reward-content">
                        {/* <div className="header-tabs-reward">
                            <div
                                className="tab-item-header"
                                style={{
                                    borderBottomColor: activeTab === 1 ? '#90b0dc' : 'gray',
                                    borderBottomWidth: activeTab === 1 ? 2 : 1,
                                }}
                                onClick={() => this.setState({ activeTab: 1 })}
                            >Phần thưởng</div>
                            <div
                                className="tab-item-header"
                                style={{
                                    borderBottomColor: activeTab === 2 ? '#90b0dc' : 'gray',
                                    borderBottomWidth: activeTab === 2 ? 2 : 1,
                                }}
                                onClick={() => this.setState({ activeTab: 2 })}
                            >Yêu cầu</div>
                        </div>
                        {activeTab === 1
                            ? renderContentTabOne()
                            : renderContentTabTwo()
                        } */}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
            </Layout >
        )
    }
}

const mapStateToProps = (state) => ({

});

const actionCreators = {

}

export default connect(mapStateToProps, actionCreators)(Reward);
