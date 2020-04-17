import React from "react";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { LeftOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Button, Select, Row, Col, Radio, Checkbox } from 'antd';

import "./AddMember.css";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { memberActions } from "../../../actions/member.actions";
import { indexConstants } from "../../../constants/index.constants";

const { Header, Footer, Content } = Layout;

class AddMember extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mAge: 20,
            mName: "",
            mEmail: "",
            mRole: "Cha",
            mAvatar: null,
            mIsAdmin: false,
            avatarType: "#f7c2c1",
            currentUrlImg: indexConstants.UPLOAD_IMG,
        }
    }

    handleChangeInput = (e) => {

        const { name, value } = e.target;
        this.setState({ [name]: value });

    }

    handleChangeImg = (e) => {
        this.setState({ 
            mAvatar: e.target.files[0], 
            currentUrlImg: URL.createObjectURL(e.target.files[0])
        });
    }

    handleClickBack = () => {
        history.push("/family");
    }

    handleSubmit = () => {

        const { addMember } = this.props;
        const { mName, mEmail, mAvatar, mAge, mRole, mIsAdmin, avatarType } = this.state;

        if (avatarType === "camera" && mAvatar) {
            const uploadTask = storage.ref().child(`images/${mAvatar.name}`).put(mAvatar);
            uploadTask.on('state_changed', function (snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                console.log(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    const userInfor = {
                        mName, mEmail, mAge, mRole, mIsAdmin,
                        "mAvatar": {
                            "image": downloadURL
                        }
                    }
                    addMember(userInfor);
                });
            });

        } else {
            let background;
            if (avatarType === "camera") {
                background = "#f7c2c1"
            } else {
                background = avatarType;
            }

            const userInfor = { 
                mAge, mRole, mName, mEmail, mIsAdmin, 
                "mAvatar": { 
                    "color": background, 
                    "image": indexConstants.MEMBER_IMG_DEFAULT
                } 
            }
            addMember(userInfor);
        }
    }

    render() {

        const { avatarType, currentUrlImg, mName, mEmail, mAge, mRole } = this.state;

        return (

            <Layout style={{ minHeight: '100vh' }}>

                <DashboardMenu menuItem="1" />

                <Layout className="site-layout">

                    <Header className="site-layout-background" >

                        <Row style={{ textAlign: "center" }}>
                            <Col flex="30px">
                                <Button onClick={this.handleClickBack} style={{ marginLeft: "10px" }} size="large" >
                                    <LeftOutlined />
                                </Button>
                            </Col>
                            <Col flex="auto"> <div className="title-header">Create Profile</div> </Col>
                        </Row>

                    </Header>

                    <Content className="site-layout-background" style={{ margin: 40 }}>

                        <Row justify="center" align="middle" style={{ height: "100%" }}>

                            <Col span={6}>

                                <Form onFinish={this.handleSubmit} size="large" initialValues={{ remember: true }} >

                                    <Form.Item style={{ textAlign: "center" }}>
                                        {avatarType === "camera" ?
                                            (
                                                <div className="container-profile-img">
                                                    <img src={currentUrlImg} className="img-profile" />
                                                    <input onChange={this.handleChangeImg} type="file" className="input-profile-img" />
                                                </div>
                                            ) : (
                                                <img src={profileImg} className="img-profile" style={{backgroundColor: avatarType}} />
                                            )
                                        }
                                    </Form.Item>

                                    <Form.Item>
                                        <Radio.Group
                                            onChange={(e) => (this.setState({ avatarType: e.target.value }))}
                                            defaultValue="pink" style={{ display: "flex", justifyContent: "space-between" }}
                                            
                                        >
                                            <Radio.Button value="camera" className="avatar camera-avatar"> <i className="fa fa-camera camera-icon" aria-hidden="true"/> </Radio.Button>
                                            <Radio.Button value="#f7c2c1" className="avatar avatar1" style={{backgroundColor: "#f7c2c1"}}></Radio.Button>
                                            <Radio.Button value="#fcefc3" className="avatar avatar2" style={{backgroundColor: "#fcefc3"}}></Radio.Button>
                                            <Radio.Button value="#fadec2" className="avatar avatar3" style={{backgroundColor: "#fadec2"}}></Radio.Button>
                                            <Radio.Button value="#e4cce2" className="avatar avatar4" style={{backgroundColor: "#e4cce2"}}></Radio.Button>
                                            <Radio.Button value="#d3dff1" className="avatar avatar5" style={{backgroundColor: "#d3dff1"}}></Radio.Button>
                                            <Radio.Button value="#9dcc80" className="avatar avatar6" style={{backgroundColor: "#9dcc80"}}></Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                                        <Input
                                            type="text" placeholder="Name"
                                            name="mName" value={mName} onChange={this.handleChangeInput}
                                            prefix={<i className="fa fa-user" aria-hidden="true"></i>}
                                        />
                                    </Form.Item>

                                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                                        <Input
                                            type="text" placeholder="Username or Email"
                                            name="mEmail" value={mEmail} onChange={this.handleChangeInput}
                                            prefix={<i className="fa fa-envelope" aria-hidden="true"></i>}
                                        />
                                    </Form.Item>

                                    <Form.Item name="age" rules={[{ required: true, message: 'Please input your Age!' }]}>
                                        <Input
                                            type="number" placeholder="Age"
                                            name="mAge" value={mAge} onChange={this.handleChangeInput}
                                            prefix={<i className="fa fa-birthday-cake" aria-hidden="true"></i>}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Row style={{ width: '100%' }}>
                                            <Col span={16}>
                                                <Select defaultValue={mRole} onChange={(value => (this.setState({ mRole: value }) ))} >
                                                    <Select.Option value="Mẹ">Mẹ</Select.Option>
                                                    <Select.Option value="Cha">Cha</Select.Option>
                                                    <Select.Option value="Anh Trai">Anh Trai</Select.Option>
                                                    <Select.Option value="Chị Gái">Chị Gái </Select.Option>
                                                    <Select.Option value="Con Trai">Con Trai</Select.Option>
                                                </Select>
                                            </Col>
                                            <Col span={8}>
                                                <Checkbox
                                                    style={{ float: "right", lineHeight: 3 }}
                                                    onChange={(e) => (this.setState({ mIsAdmin: e.target.checked }))}
                                                > Admin 
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item>
                                        <Row>
                                            <Col span={24}> 
                                                <Button style={{ width: "100%" }} type="primary" ghost htmlType="submit" >Create</Button> 
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                </Form>

                            </Col>

                        </Row>

                    </Content>

                    <Footer style={{ textAlign: 'center' }}></Footer>

                </Layout>

            </Layout>

        );
    }
}

const actionCreators = {
    addMember: memberActions.addMember
}

export default connect(null, actionCreators)(AddMember);