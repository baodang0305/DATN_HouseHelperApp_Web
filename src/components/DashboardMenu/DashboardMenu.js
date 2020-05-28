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
                        <Link to="#">Mua Sắm</Link>
                    </Menu.Item>

                </Menu>

            </Sider>

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