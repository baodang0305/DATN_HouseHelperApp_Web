import React from 'react';
import { Layout, Menu } from 'antd';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { HomeOutlined, CalendarOutlined, CheckOutlined, GiftOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import './DashboardMenu.css';

const { Sider } = Layout;

class DashboardMenu extends React.Component {

    render() {

        const { menuItem, user } = this.props;

        return (
            <>
                <Sider className="container-dashboard-menu">

                    <div className="container-infor-family">
                        <div> <img className="container-img-family" src={user.fImage} /> </div>
                        <div className="name-family"> {user.fName} </div>
                    </div>

                    <Menu theme="dark" defaultSelectedKeys={menuItem} mode="inline">

                        <Menu.Item key="1" >
                            <HomeOutlined className="size-icon" />
                            <Link to="/family">Gia Đình</Link>
                        </Menu.Item>

                        <Menu.Item key="2">
                            <CalendarOutlined className="size-icon" />
                            <Link to="/calendar">Lịch</Link>
                        </Menu.Item>

                        <Menu.Item key="3">
                            <CheckOutlined className="size-icon" />
                            <Link to="/tasks">Công Việc</Link>
                        </Menu.Item>

                        <Menu.Item key="4">
                            <GiftOutlined className="size-icon" />
                            <Link to="/rewards">Phần Thưởng</Link>
                        </Menu.Item>

                        <Menu.Item key="5">
                            <ShoppingCartOutlined className="size-icon" />
                            <Link to="/grocery">Mua Sắm</Link>
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

export default connect(mapStateToProps)(DashboardMenu);