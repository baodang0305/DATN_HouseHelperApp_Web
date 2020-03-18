import React from "react";
import { Layout, Input, Divider, Row, Col, Tag, Button, Modal, List, Avatar } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import familyImg from "../../assets/family-img.png";
import history from "../../helpers/history";
import "./Message.css";

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

class Message extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    showModal = () => {
        this.setState({
          visible: true
        });
    };
    
    handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
    };

    handleClickBack = () => {
        history.goBack();
    }

    render() {

        const data = [
            {
              title: 'Bao Dang',
            },
            {
              title: 'Nguyen Huong',
            },
            {
              title: 'Nguyen Van',
            },
            {
              title: 'Nguyen C',
            },
        ];

        return (
            <Layout style={{ minHeight: '100vh'}}>
                <DashboardMenu menuItem="1" familyImg={familyImg}/>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0}}>
                        <Row>
                            <Col flex="30px"> <i onClick={this.handleClickBack} className="fa fa-arrow-circle-o-left fa-3x back-icon" aria-hidden="true"></i> </Col>
                            <Col flex="auto"><h2 style={{textAlign: "center"}}>Message</h2></Col>
                        </Row>
                    </Header>
                    <Content className="site-layout-background content-container">
                        <div className="textarea-container">
                            <TextArea rows={10} className="textarea" placeholder="Enter message"/>
                            <div className="tool-container">
                                <i className="fa fa-upload fa-lg" aria-hidden="true" style={{marginLeft: "20px", marginRight: "20px"}}></i>
                                <i className="fa fa-link fa-lg" aria-hidden="true" style={{marginRight: "20px"}}></i>
                                <i className="fa fa-video-camera fa-lg" aria-hidden="true" style={{marginRight: "20px"}}></i>
                                <i className="fa fa-quote-right fa-lg" aria-hidden="true" style={{marginRight: "20px"}}></i>
                            </div>
                        </div>
                        <Divider />
                        <Row justify="center" align="middle">
                            <Col md={1} style={{fontSize: "18px"}}> To: </Col>
                            <Col md={22}> 
                                <div className="selector-container"> 
                                    <Tag className="tag-item" color="blue" closable> To all member</Tag>
                                    <span className="add-more">< PlusOutlined /> <span onClick={this.showModal} >Add More</span></span>
                                    <Modal
                                        title="All Member"
                                        visible={this.state.visible}
                                        footer={[
                                            <Button key="back" onClick={this.handleCancel}>
                                                Cancel
                                            </Button>
                                        ]}
                                        >
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={data}
                                            renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                title={<Button style={{width: "200px"}}>{item.title}</Button>}
                                                />
                                            </List.Item>
                                            )}
                                        />
                                    </Modal>
                                </div>
                            </Col>
                        </Row>
                        <Divider />
                        
                        <Button type="primary" className="send-button"> Send </Button>
                        
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Message;