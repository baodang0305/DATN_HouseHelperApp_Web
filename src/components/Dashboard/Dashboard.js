import React from 'react';
import { Layout, Menu, Avatar} from 'antd';
import {
    HomeOutlined,
    CalendarOutlined,
    CheckOutlined,
    GiftOutlined,
    ShoppingCartOutlined,
    FileOutlined
} from '@ant-design/icons';
import Task from '../Task/Task';
import Family from '../Family/Family';
import './Dashboard.css';
import familyImg from '../../assets/dashboard.png';

const { Sider } = Layout;

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            keyItem: "1"
        }
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };
    
    handleClick = e => {
        this.setState({
            keyItem: e.key
        });
    }

    render() {

        const {collapsed, keyItem} = this.state;

        let content;
        switch(keyItem) {
            case "1": {
                content = <Family />;
                break;
            }
            case "2": {
                content = <Family />;
                break;
            }
            case "3": {
                content = <Task />;
                break;
            }
            case "4": {
                content = <Family />;
                break;
            }
            case "5": {
                content = <Family />;
                break;
            }
            default: {
                content = <Family />;
            }
        }

        return (
            <Layout style={{ minHeight: '100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                        <div className="center1">
                            <div className="center2">
                                <Avatar shape="circle" size={100} src={familyImg}/>
                                <div>Family Name</div>
                            </div>
                        </div>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.handleClick}>
                        <Menu.Item key="1">
                            <HomeOutlined />
                            <span to="/family">Family</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <CalendarOutlined />
                            <span>Calendar</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <CheckOutlined />
                            <span>Tasks</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <GiftOutlined />
                            <span>Rewards</span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <ShoppingCartOutlined />
                            <span>Groceries</span>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <FileOutlined />
                        </Menu.Item>
                    </Menu>
                </Sider>
                {content}
            </Layout>
        );
    }
}

export default Landing;