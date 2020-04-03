import React from 'react';
import { Layout, Menu } from 'antd';
import {Link} from 'react-router-dom';
import {
    HomeOutlined,
    CalendarOutlined,
    CheckOutlined,
    GiftOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import familyImg from "../../assets/family-img.png";
import './DashboardMenu.css';

const { Sider } = Layout;

class DashboardMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render() {

        const {collapsed} = this.state;
        const {menuItem} = this.props;
        return (
            <Sider className="container-dashboard-menu" trigger={null} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="container-infor-family">
                    <div>
                        <img className="container-img-family" src={familyImg}/>
                    </div>
                    <div className="name-family">Family Name</div>
                </div>
                <Menu theme="dark" defaultSelectedKeys={menuItem} mode="inline">
                    <Menu.Item key="1" >
                        <HomeOutlined className="size-icon"/>
                        <Link to="/family">Family</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <CalendarOutlined className="size-icon"/>
                        <Link to="#">Calendar</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <CheckOutlined className="size-icon"/>
                        <Link to="/tasks">Tasks</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <GiftOutlined className="size-icon"/>
                        <Link to="#">Rewards</Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <ShoppingCartOutlined className="size-icon"/>
                        <Link to="#">Groceries</Link>
                    </Menu.Item>    
                </Menu>
            </Sider>
        );
    }
}

export default DashboardMenu;