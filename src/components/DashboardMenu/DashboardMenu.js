import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { HomeOutlined, CalendarOutlined, CheckOutlined, GiftOutlined, ShoppingCartOutlined, DownOutlined } from '@ant-design/icons';
import { memberActions } from "../../actions/member.actions";
import history from "../../helpers/history";
import './DashboardMenu.css';

const { Sider } = Layout;

class DashboardMenu extends React.Component {
    handleClickLogout = () => {
        const { logout } = this.props;
        history.push("/login");
        logout();
    }
    render() {

        const { menuItem, user } = this.props;

        return (
            <>
                <Sider className="container-dashboard-menu">

                    <div className="container-infor-family" style={{ marginBottom: 50 }}>
                        <div> <img className="container-img-family" src={user.fImage} /> </div>
                        <div className="name-family"> {user.fName} </div>
                        <div className="name-user">
                            <Dropdown overlay={
                                <Menu>
                                    <Menu.Item>
                                        <Link to={{ pathname: "/family/setting/my-account", state: { "fromSetting": true, "member": user } }}>Tài khoản của tôi</Link>
                                    </Menu.Item>
                                    <Menu.Item onClick={this.handleClickLogout}>
                                        Đăng xuất
                                </Menu.Item>
                                </Menu>
                            } placement="bottomCenter">
                                <a style={{ color: 'white' }} onClick={e => e.preventDefault()}>
                                    {user.mName} <DownOutlined />
                                </a>
                            </Dropdown>
                        </div>
                    </div>

                    <Menu defaultSelectedKeys={menuItem} mode="inline" className="main-menu">

                        <Menu.Item key="1" >
                            <HomeOutlined className="size-icon" />
                            <Link to="/family">Gia đình</Link>
                        </Menu.Item>

                        <Menu.Item key="2">
                            <CalendarOutlined className="size-icon" />
                            <Link to="/calendar">Lịch</Link>
                        </Menu.Item>

                        <Menu.Item key="3">
                            <CheckOutlined className="size-icon" />
                            <Link to="/tasks">Công việc</Link>
                        </Menu.Item>

                        <Menu.Item key="4">
                            <GiftOutlined className="size-icon" />
                            <Link to="/rewards">Phần thưởng</Link>
                        </Menu.Item>

                        <Menu.Item key="5">
                            <ShoppingCartOutlined className="size-icon" />
                            <Link to="/grocery">Mua sắm</Link>
                        </Menu.Item>

                    </Menu>

                </Sider>
                <div className="mobile__container-dashboard-menu">
                    <Menu className="mobile__menu" defaultSelectedKeys={menuItem}>
                        <Menu.Item key="1" className="mobile__menu-item">
                            <HomeOutlined className="size-icon" />
                            <Link to="/family">Gia đình</Link>
                        </Menu.Item>

                        <Menu.Item key="2" className="mobile__menu-item">
                            <CalendarOutlined className="size-icon" />
                            <Link to="/calendar">Lịch biểu</Link>
                        </Menu.Item>

                        <Menu.Item key="3" className="mobile__menu-item">
                            <CheckOutlined className="size-icon" />
                            <Link to="/tasks">Công việc</Link>
                        </Menu.Item>

                        <Menu.Item key="4" className="mobile__menu-item">
                            <GiftOutlined className="size-icon" />
                            <Link to="/rewards">Phần thưởng</Link>
                        </Menu.Item>

                        <Menu.Item key="5" className="mobile__menu-item">
                            <ShoppingCartOutlined className="size-icon" />
                            <Link to="/grocery">Mua sắm</Link>
                        </Menu.Item>
                    </Menu>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    const { inforLogin } = state.authentication;
    if (inforLogin) {
        const { user } = inforLogin;
        return {
            user
        }
    }
}
const actionCreators = {
    logout: memberActions.logout
}

export default connect(mapStateToProps, actionCreators)(DashboardMenu);