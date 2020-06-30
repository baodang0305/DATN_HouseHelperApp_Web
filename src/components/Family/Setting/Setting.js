import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Button } from "antd";
import { LeftOutlined, CaretRightOutlined } from "@ant-design/icons";

import "./Setting.css";
import { connect } from "react-redux";
import history from "../../../helpers/history";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { memberActions } from "../../../actions/member.actions";

const { Header, Content, Footer } = Layout;

class Setting extends React.Component {

    handleClickBack = () => {
        history.push("/family");
    }

    handleClickLogout = () => {
        const { logout } = this.props;
        history.push("/login");
        logout();
    }

    render() {

        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { user } = inforLogin;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <div className="left-header-setting-container">
                            <div onClick={this.handleClickBack} className="header__btn-link" >
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                        </div>
                        <div className="center-header-setting-container">Cài Đặt</div>
                        <div style={{ width: "30%" }}></div>
                    </Header>
                    <Content >
                        <Link to={{ pathname: "/family/setting/my-account", state: { "fromSetting": true, "member": user } }} >
                            <div className="panel-container">
                                <span className="panel-content"> < i className="fa fa-user-o custom-icon" /> Tài khoản của tôi </span>
                                <CaretRightOutlined className="caretright-icon" />
                            </div>
                        </Link>
                        <Link to="/family/setting/update-family" >
                            <div className="panel-container">
                                <span className="panel-content"> <i className="fa fa-home custom-icon" /> Tài khoản gia đình </span>
                                <CaretRightOutlined className="caretright-icon" />
                            </div>
                        </Link>
                        <Link to="/task-category" >
                            <div className="panel-container">
                                <span className="panel-content"> <i className="fa fa-book custom-icon" /> Loại công việc </span>
                                <CaretRightOutlined className="caretright-icon" />

                            </div>
                        </Link>
                        <div className="panel-container" onClick={this.handleClickLogout}>
                            <span className="panel-content"> <i className="fa fa-sign-out custom-icon" /> Đăng xuất </span>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}> </Footer>
                </Layout>
            </Layout>
        );
    }
}

const actionCreators = {
    logout: memberActions.logout
}

export default connect(null, actionCreators)(Setting);