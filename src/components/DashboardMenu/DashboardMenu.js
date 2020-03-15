import React from 'react';
import { Layout, Menu, Avatar} from 'antd';
import {Link} from 'react-router-dom';
import {
    HomeOutlined,
    CalendarOutlined,
    CheckOutlined,
    GiftOutlined,
    ShoppingCartOutlined,
    FileOutlined
} from '@ant-design/icons';
import './DashboardMenu.css';
import familyImgDefault from '../../assets/familyImgDefault.png';

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
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="center">
                    <div>
                        <Avatar shape="circle" style={{backgroundColor: "#ffffff"}} size={100} src={familyImgDefault}/>
                        <div className="family-name">Family Name</div>
                    </div>
                </div>
                <Menu theme="dark" defaultSelectedKeys={menuItem} mode="inline">
                    <Menu.Item key="1" >
                        <HomeOutlined />
                        <Link to="/family">Family</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <CalendarOutlined />
                        <Link to="#">Calendar</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <CheckOutlined />
                        <Link to="/tasks">Tasks</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <GiftOutlined />
                        <Link to="#">Rewards</Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <ShoppingCartOutlined />
                        <Link to="#">Groceries</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <FileOutlined />
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

export default DashboardMenu;