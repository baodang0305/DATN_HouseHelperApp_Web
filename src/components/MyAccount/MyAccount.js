import React from "react";
import { Layout, Form, Input, Button, Select, Row, Col, Radio, Checkbox } from 'antd';
import { LeftOutlined, LockOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import firebase from "firebase";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import profileImg from "../../assets/profile-img.png";
import history from "../../helpers/history";
import { indexConstants } from "../../constants/index.constants";
import { storage } from "../../helpers/firebaseConfig";
import { memberActions } from "../../actions/member.actions";
import "./MyAccount.css";

const { Header, Footer, Content } = Layout;

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mRole: "",
            mIsAdmin: false,
            isSetPass: false,
            mCurrentPass: "",
            mNewPass: "",
            mConfirmPass: "",
            errorCurrentPass: null,
            errorNewPass: null,
            errorConfirmPass: null,
            stateNewPass: "",
            stateCurrentPass: "",
            stateConfirmPass: "",
            avatarType: "",
            mAvatar: null,
            currentUrlImg: indexConstants.UPLOAD_IMG,
        }
    }

    componentWillMount() {
        const { user } = this.props;
        this.setState({ 
            mRole: user.mRole,
            mIsAdmin: user.mIsAdmin    
        });
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        let errorCurrentPass, errorNewPass, errorConfirmPass;
        let stateCurrentPass, stateNewPass, stateConfirmPass;

        if (name === "mCurrentPass") {
            if (value === "") {
                errorCurrentPass = "Please input your current password!";
                stateCurrentPass = "error";
                this.setState({
                    mCurrentPass: value,
                    errorCurrentPass,
                    stateCurrentPass
                });
            } else {
                this.setState({
                    mCurrentPass: value,
                    errorCurrentPass: null,
                    stateCurrentPass: ""
                });
            }
        }
        if (name === "mNewPass") {
            if (value === "") {
                errorNewPass = "Please input your new password!";
                stateNewPass = "error";
                this.setState({
                    mNewPass: value,
                    errorNewPass,
                    stateNewPass
                });
            } else {
                this.setState({
                    mNewPass: value,
                    errorNewPass: null,
                    stateNewPass: ""
                });
            }
        }
        if (name === "mConfirmPass") {
            const { mNewPass } = this.state;
            if ((value === "") || (value !== mNewPass)) {
                errorConfirmPass = "confirm password is invalid!";
                stateConfirmPass = "error";
                this.setState({
                    mConfirmPass: value,
                    errorConfirmPass,
                    stateConfirmPass
                });
            } else {
                this.setState({
                    mConfirmPass: value,
                    errorConfirmPass: null,
                    stateConfirmPass: ""
                });
            }
        }
    }

    handleChangeImg = (e) => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            mAvatar: e.target.files[0]
        });
    }

    handleClickSetPassword = (e) => {
        if (e.target.checked === true) {
            this.setState({
                isSetPass: e.target.checked,
                stateCurrentPass: "error",
                stateNewPass: "error",
                stateConfirmPass: "error",
                errorCurrentPass: "Please input your current password!",
                errorNewPass: "Please input your new password!",
                errorConfirmPass: "confirm password is invalid!"
            });
        } else {
            this.setState({
                isSetPass: e.target.checked,
                stateCurrentPass: "",
                stateNewPass: "",
                stateConfirmPass: "",
                errorCurrentPass: null,
                errorNewPass: null,
                errorConfirmPass: null,
                mCurrentPass: "",
                mNewPass: "",
                mConfirmPass: ""
            });
        }
    }

    handleClickBack = () => {
        history.goBack();
    }

    handleSubmit = (fieldsValue) => {

        const { isSetPass, mCurrentPass, mNewPass, mConfirmPass, stateConfirmPass, avatarType, mAvatar, mRole, mIsAdmin } = this.state;
        const { editMember, changePassword, user } = this.props;

        if (isSetPass) {
            if (mCurrentPass !== "" && mNewPass !== "" && mConfirmPass !== "" && stateConfirmPass !== "error") {

                if (avatarType === "camera" && mAvatar) {

                    const uploadTask = storage.ref().child(`images/${mAvatar.name}`).put(mAvatar);
                    uploadTask.on("state_changed", function (snapshot) {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is " ${progress} %done`);
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED:
                                console.log("Upload is paused");
                                break;
                            case firebase.storage.TaskState.RUNNING:
                                console.log("Upload is running");
                                break;
                        }
                    }, function (error) {
                        console.log(error);
                    }, async function () {
                        const imgUrl = await uploadTask.snapshot.ref.getDownloadURL();
                        editMember({
                            "mName": fieldsValue.mName,
                            "mEmail": fieldsValue.mEmail,
                            "mAge": fieldsValue.mAge,
                            "mIsAdmin": mIsAdmin,
                            "mRole": mRole,
                            "mAvatar": {
                                "image": imgUrl
                            }
                        });
                    });


                } else if (avatarType === "") {
                    editMember({
                        "mName": fieldsValue.mName,
                        "mEmail": fieldsValue.mEmail,
                        "mAge": fieldsValue.mAge,
                        "mIsAdmin": mIsAdmin,
                        "mRole": mRole,
                        "mAvatar": user.mAvatar
                    });
                } else {
                    let background;
                    if (avatarType === "camera") {
                        background = "pink"
                    } else {
                        background = avatarType;
                    }
                    editMember({
                        "mName": fieldsValue.mName,
                        "mEmail": fieldsValue.mEmail,
                        "mAge": fieldsValue.mAge,
                        "mIsAdmin": mIsAdmin,
                        "mRole": mRole,
                        "mAvatar": {
                            "image": indexConstants.MEMBER_IMG_DEFAULT,
                            "color": background
                        }
                    });
                }
                changePassword({ "oldPassword": mCurrentPass, "newPassword": mNewPass });
            }
        } else {

            if (avatarType === "camera" && mAvatar) {

                const uploadTask = storage.ref().child(`images/${mAvatar.name}`).put(mAvatar);
                uploadTask.on("state_changed", function (snapshot) {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is " ${progress} %done`);
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log("Upload is paused");
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log("Upload is running");
                            break;
                    }
                }, function (error) {
                    console.log(error);
                }, async function () {
                    const imgUrl = await uploadTask.snapshot.ref.getDownloadURL();
                    editMember({
                        "mName": fieldsValue.mName,
                        "mEmail": fieldsValue.mEmail,
                        "mAge": fieldsValue.mAge,
                        "mIsAdmin": mIsAdmin,
                        "mRole": mRole,
                        "mAvatar": {
                            "image": imgUrl
                        }
                    });
                });

            } else if (avatarType === "") {
                editMember({
                    "mName": fieldsValue.mName,
                    "mEmail": fieldsValue.mEmail,
                    "mAge": fieldsValue.mAge,
                    "mIsAdmin": mIsAdmin,
                    "mRole": mRole,
                    "mAvatar": user.mAvatar
                });
            } else {
                let background;
                if (avatarType === "camera") {
                    background = "pink"
                } else {
                    background = avatarType;
                }
                editMember({
                    "mName": fieldsValue.mName,
                    "mEmail": fieldsValue.mEmail,
                    "mAge": fieldsValue.mAge,
                    "mIsAdmin": mIsAdmin,
                    "mRole": mRole,
                    "mAvatar": {
                        "image": indexConstants.MEMBER_IMG_DEFAULT,
                        "color": background
                    }
                });
            }
        }
    }

    render() {

        const {
            mRole,
            mIsAdmin,
            avatarType,
            isSetPass,
            mCurrentPass,
            mNewPass,
            mConfirmPass,
            currentUrlImg,
            stateCurrentPass,
            stateNewPass,
            stateConfirmPass,
            errorCurrentPass,
            errorNewPass,
            errorConfirmPass
        } = this.state;
        const { user } = this.props;

        let Avatar; 

        if (avatarType === "") {
            if (!user.mAvatar.color) {
                Avatar = () => (<img src={user.mAvatar.image} className="img-profile" />)
            } else {
                Avatar = () => (<img src={user.mAvatar.image} className="img-profile" style={{backgroundColor: user.mAvatar.color}} />)
            }
        } else if (avatarType === "camera") {
            Avatar = () => (
                <div className="container-profile-img">
                    <img src={currentUrlImg} className="img-profile" />
                    <input onChange={this.handleChangeImg} type="file" className="input-profile-img" />
                </div>
            )
        } else {
            Avatar = () => (<img src={profileImg} className="img-profile" style={{backgroundColor: avatarType}} />)
        }
                                          
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="site-layout-background">
                        <Row style={{ textAlign: "center" }}>
                            <Col flex="30px">
                                <Button
                                    onClick={this.handleClickBack}
                                    size="large" style={{ marginLeft: "10px" }}
                                >
                                    <LeftOutlined />
                                </Button>
                            </Col>
                            <Col flex="auto">
                                <div className="title-header">My Account</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content className="site-layout-background" style={{ margin: 40 }}>
                        <Row justify="center" align="middle" style={{ height: "100%" }}>
                            <Col span={6}>
                                <Form
                                    onFinish={this.handleSubmit} size="large"
                                    initialValues={{
                                        "mName": user.mName,
                                        "mEmail": user.mEmail,
                                        "mAge": user.mAge,
                                    }}
                                >
                                    <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
                                        <Avatar />
                                    </Form.Item>
                                    <Form.Item>
                                        <Radio.Group
                                            onChange={(e) => (this.setState({ avatarType: e.target.value }))}
                                            style={{ display: "flex", justifyContent: "space-between" }}
                                        >
                                            <Radio.Button value="camera" className="avatar camera-avatar">
                                                <i className="fa fa-camera camera-icon" aria-hidden="true"></i>
                                            </Radio.Button>
                                            <Radio.Button value="#f7c2c1" className="avatar avatar1" style={{backgroundColor: "#f7c2c1"}}></Radio.Button>
                                            <Radio.Button value="#fcefc3" className="avatar avatar2" style={{backgroundColor: "#fcefc3"}}></Radio.Button>
                                            <Radio.Button value="#fadec2" className="avatar avatar3" style={{backgroundColor: "#fadec2"}}></Radio.Button>
                                            <Radio.Button value="#e4cce2" className="avatar avatar4" style={{backgroundColor: "#e4cce2"}}></Radio.Button>
                                            <Radio.Button value="#d3dff1" className="avatar avatar5" style={{backgroundColor: "#d3dff1"}}></Radio.Button>
                                            <Radio.Button value="#9dcc80" className="avatar avatar6" style={{backgroundColor: "#9dcc80"}}></Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item name="mName" rules={[{ required: true, message: 'Please input your name!' }]}>
                                        <Input
                                            prefix={<i className="fa fa-user" aria-hidden="true"></i>}
                                            placeholder="Name"
                                            type="text"
                                        />
                                    </Form.Item>
                                    <Form.Item name="mEmail" rules={[{ required: true, message: 'Please input your email!' }]} >
                                        <Input
                                            prefix={<i className="fa fa-envelope" aria-hidden="true"></i>}
                                            placeholder="Email"
                                            type="text"
                                        />
                                    </Form.Item>
                                    <Form.Item name="mAge" rules={[{ required: true, message: 'Please input your Age!' }]}>
                                        <Input
                                            prefix={<i className="fa fa-birthday-cake" aria-hidden="true"></i>}
                                            placeholder="Age"
                                            type="number"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Row style={{ width: '100%' }}>
                                            <Col span={16}>
                                                <Select defaultValue={mRole} onChange={(value) => ( this.setState({ mRole: value }) )} >
                                                    <Select.Option value="Cha">Cha</Select.Option>
                                                    <Select.Option value="Mẹ">Mẹ</Select.Option>
                                                </Select>
                                            </Col>
                                            <Col span={8}>
                                                <Checkbox
                                                    checked={mIsAdmin}
                                                    onChange={(e) => (this.setState({ mIsAdmin: e.target.checked }))}

                                                    style={{ float: "right", lineHeight: 3 }}
                                                > Admin </Checkbox>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item >
                                        <Checkbox
                                            onChange={this.handleClickSetPassword}>
                                            <span style={{ fontSize: "18px" }}> <LockOutlined /> Set personal password </span>
                                        </Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        validateStatus={stateCurrentPass}
                                        help={errorCurrentPass}
                                    >
                                        <Input
                                            name="mCurrentPass" value={mCurrentPass} onChange={this.handleChangeInput}
                                            placeholder="current password" type="password" disabled={!isSetPass}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        validateStatus={stateNewPass}
                                        help={errorNewPass}
                                    >
                                        <Input
                                            name="mNewPass" value={mNewPass} onChange={this.handleChangeInput}
                                            placeholder="new password" type="password" disabled={!isSetPass}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        validateStatus={stateConfirmPass}
                                        help={errorConfirmPass}
                                    >
                                        <Input
                                            name="mConfirmPass" value={mConfirmPass} onChange={this.handleChangeInput}
                                            placeholder="confirm password" type="password" disabled={!isSetPass}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Row>
                                            <Col span={11}>
                                                <Button className="delete-button" >
                                                    Delete
                                                </Button>
                                            </Col>

                                            <Col span={11} offset={2}>
                                                <Button className="save-button" type="primary" htmlType="submit" >
                                                    Save
                                                </Button>
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

const mapStateToProps = (state) => {
    const { inforLogin } = state.authentication;
    const { user } = inforLogin;
    return {
        user
    }
}

const actionCreators = {
    editMember: memberActions.editMember,
    changePassword: memberActions.changePassword
}

export default connect(mapStateToProps, actionCreators)(MyAccount);