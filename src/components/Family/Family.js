import React from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Divider, List, Avatar, Button} from "antd";
import { Link } from "react-router-dom";
import { 
    PlusOutlined , 
    SettingOutlined, 
    MailOutlined,
    StarOutlined,
    LikeOutlined,
    MessageOutlined
} from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import profileImg from "../../assets/profile-img.png";
import "./Family.css";
import { familyActions } from "../../actions/family.actions";

const { Header, Content, Footer } = Layout;

class Family extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { getAllMembers } = this.props;
        getAllMembers();
    }

    render() {
        const { members } = this.props;
        let listMembers;
        if (members) {
            listMembers =
                members.map((member, id) =>
                    <Col md={8} className="col-modified" key={id}>
                        <div className="container-img-profile">
                            <img src={member.mAvatar} className="profile-img"></img>
                            <div className="badge">{member.mPoints}</div>
                            <div className="size-member-name">{member.mName}</div>
                        </div>
                    </Col>
                );
        }

        const listData = [];
        for (let i = 0; i < 23; i++) {
            listData.push({
                title: `Activity ${i}`,
                // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                description: 'You need to describe an activity that take place.'
            });
        }

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

                    <Header className="site-layout-background" >
                        <Row style={{ width: '100%' }}>
                            <Col span={10} className="header-part-left" >
                                <Button style={{ marginRight: 10 }} size="large">
                                    <Link to="/family/setting"> <SettingOutlined className="size-icon" /> </Link>
                                </Button>
                                <Button size="large">
                                    <Link to="/family/chat"> <MailOutlined className="size-icon" /> </Link>
                                </Button>
                            </Col>

                            <Col span={4} className="header-title">Family</Col>

                            <Col span={10} className="header-part-right">
                                <Button style={{ marginRight: 10 }} size="large">
                                    <Link to="/family/add-member"> <PlusOutlined  className="size-icon" /> </Link>
                                </Button>
                            </Col>
                        </Row>
                    </Header>

                    <Content style={{padding: 20}}>

                        <Row className="row-modified">
                            <Divider orientation="left" className="divider-modified">
                                All Member
                            </Divider>
                            {listMembers}
                        </Row>

                        <Row className="row-modified">
                            <Divider orientation="left" className="divider-modified">
                                All Activities
                            </Divider>
                            <List
                                className="list-modified"
                                itemLayout="vertical"
                                size="large"
                                pagination={{
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 3,
                                }}
                                dataSource={listData}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <IconText icon={StarOutlined} text="0" key="list-vertical-star-o" />,
                                            <IconText icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
                                            <IconText icon={MessageOutlined} text="0" key="list-vertical-message" />,
                                        ]}
                                        extra={
                                            <img
                                                className="activity-img"
                                                alt="logo"
                                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                            />
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={profileImg} />}
                                            title={<div>{item.title}</div>}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Row>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

const  mapStateToProps = (state) => {
    const { members } = state.family;
    return { members };
}

const actionCreators = {
    getAllMembers: familyActions.getAllMembers
}
export default connect(mapStateToProps, actionCreators)(Family);