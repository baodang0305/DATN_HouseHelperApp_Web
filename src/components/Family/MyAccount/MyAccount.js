import React from "react";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { LeftOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Button, Select, Row, Col, Radio, Checkbox, Modal } from 'antd';

import "./MyAccount.css";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from "../../../actions/family.actions";
import { memberActions } from "../../../actions/member.actions";
import { indexConstants } from "../../../constants/index.constants";

const { Header, Footer, Content } = Layout;

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mRole: "",
            mNewPass: "",
            fPassword: "",
            mAvatar: null,
            avatarType: "",
            mIsAdmin: false,
            isSetPass: false,
            mConfirmPass: "",
            mCurrentPass: "",
            stateNewPass: "",
            errorNewPass: null,
            emailResetPass: "",
            stateCurrentPass: "",
            stateConfirmPass: "",
            errorCurrentPass: null,
            errorConfirmPass: null,
            stateEmailResetPass: "",
            errorEmailResetPass: null,
            visibleResetFamilyPassword: false,
            visibleRequestResetPassword: false,
            currentUrlImg: indexConstants.UPLOAD_IMG,
        }
    }

    componentWillMount() {

        const { member } = this.props.location.state;
        this.setState({ mRole: member.mRole, mIsAdmin: member.mIsAdmin });

    }

    handleClickBack = () => {
        const { fromSetting, member } = this.props.location.state;

        if (fromSetting) {
            history.push("/family/setting");
        } else {
            history.push({ pathname: "/family/member", search: `?id=${member._id}`, state: { member } });
        }
    }

    showBoxRequestResetPassword = () => {
        this.setState({ visibleRequestResetPassword: true });
    };

    showBoxResetFamilyPassword = () => {
        this.setState({ visibleResetFamilyPassword: true });
    }

    handleSendRequestResetPassword = e => {

        const { requestResetPassword } = this.props;
        const { stateEmailResetPass, emailResetPass } = this.state;

        if (stateEmailResetPass === "" && emailResetPass !== "") {

            this.setState({ emailResetPass: "", visibleRequestResetPassword: false });
            requestResetPassword({ "email": emailResetPass, "type": "member" });

        } else {
            this.setState({ emailResetPass: "", stateEmailResetPass: "error", errorEmailResetPass: "Please input your email" });
        }

    };

    handleCancelRequestResetPassword = e => {
        this.setState({ emailResetPass: "", stateEmailResetPass: "", errorEmailResetPass: null, visibleRequestResetPassword: false });
    };

    handleSendResetFamilyPassword = e => {

        const { resetFamilyPassword } = this.props;
        const { stateFamilyPassword, fPassword } = this.state;
        const { fromSetting, member } = this.props.location.state;

        if (stateFamilyPassword === "" && fPassword !== "") {
            this.setState({ fPassword: "", visibleResetFamilyPassword: false });
            resetFamilyPassword({ "fPassword": fPassword, "mID":  member._id});
        } else {
            this.setState({ fPassword: "", stateFamilyPassword: "error", errorFamilyPassword: "Please input your family password"});
        }

    };

    handleCancelResetFamilyPassword = e => {
        this.setState({ fPassword: "", stateFamilyPassword: "", errorFamilyPassword: null, visibleResetFamilyPassword: false });
    };

    handleChangeInput = (e) => {

        const { name, value } = e.target;
        let errorCurrentPass, errorNewPass, errorConfirmPass;
        let stateCurrentPass, stateNewPass, stateConfirmPass;

        if (name === "mCurrentPass") {
            if (value === "") {
                stateCurrentPass = "error";
                errorCurrentPass = "Please input your current password!";
                this.setState({ mCurrentPass: value, errorCurrentPass, stateCurrentPass });
            } else {
                this.setState({ mCurrentPass: value, errorCurrentPass: null, stateCurrentPass: "" });
            }
        }

        if (name === "mNewPass") {
            if (value === "") {
                stateNewPass = "error";
                errorNewPass = "Please input your new password!";
                this.setState({ mNewPass: value, errorNewPass, stateNewPass });
            } else {
                this.setState({ mNewPass: value, errorNewPass: null, stateNewPass: "" });
            }
        }

        if (name === "mConfirmPass") {
            const { mNewPass } = this.state;
            if ((value === "") || (value !== mNewPass)) {
                errorConfirmPass = "confirm password is invalid!";
                stateConfirmPass = "error";
                this.setState({ mConfirmPass: value, errorConfirmPass, stateConfirmPass });
            } else {
                this.setState({ mConfirmPass: value, errorConfirmPass: null, stateConfirmPass: "" });
            }
        }

        if (name === "emailResetPass") {
            if (value !== "") {
                this.setState({ emailResetPass: value, stateEmailResetPass: "", errorEmailResetPass: null });
            } else {
                this.setState({ emailResetPass: value, stateEmailResetPass: "error", errorEmailResetPass: "Please input your email" });
            }
        }

        if (name === "fPassword") {
            if (value !== "") {
                this.setState({ fPassword: value, stateFamilyPassword: "", errorFamilyPassword: null });
            } else {
                this.setState({ fPassword: value, stateFamilyPassword: "error", errorFamilyPassword: "Please input your family password" });
            }
        }

    }

    handleChangeImg = (e) => {

        this.setState({ currentUrlImg: URL.createObjectURL(e.target.files[0]), mAvatar: e.target.files[0] });

    }

    handleClickSetPassword = (e) => {

        if (e.target.checked === true) {

            this.setState({ stateNewPass: "error", stateCurrentPass: "error", stateConfirmPass: "error", isSetPass: e.target.checked });

        } else {

            this.setState({
                mNewPass: "",
                stateNewPass: "",
                mCurrentPass: "",
                mConfirmPass: "",
                errorNewPass: null,
                stateCurrentPass: "",
                stateConfirmPass: "",
                errorCurrentPass: null,
                errorConfirmPass: null,
                isSetPass: e.target.checked
            });

        }

    }

    handleSubmit = (fieldsValue) => {

        const { editMember, changePassword } = this.props;
        const { fromSetting, member } = this.props.location.state;
        const { isSetPass, mCurrentPass, mNewPass, mConfirmPass, stateConfirmPass, avatarType, mAvatar, mRole, mIsAdmin } = this.state;

        const inforUpdateTemp = {
            "mRole": mRole,
            "member": member,
            "mIsAdmin": mIsAdmin,
            "isSetPass": isSetPass,
            "mAge": fieldsValue.mAge,
            "fromSetting": fromSetting,
            "mName": fieldsValue.mName,
            "mEmail": fieldsValue.mEmail,
        }

        if (isSetPass) {

            if (mCurrentPass !== "" && mNewPass !== "" && mConfirmPass !== "" && stateConfirmPass !== "error") {

                if (avatarType === "") {

                    const inforUpdate = { ...inforUpdateTemp, "mAvatar": member.mAvatar }
                    editMember(inforUpdate);

                } else if (avatarType === "camera" && mAvatar) {

                    const uploadTask = storage.ref().child(`images/${mAvatar.name}`).put(mAvatar);
                    uploadTask.on("state_changed", function (snapshot) {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress} %done`);
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
                        const inforUpdate = { ...inforUpdateTemp, "mAvatar": { "image": imgUrl } }
                        editMember(inforUpdate);
                    });

                } else {

                    let background;
                    if (avatarType === "camera") {
                        background = "pink"
                    } else {
                        background = avatarType;
                    }

                    const inforUpdate = { ...inforUpdateTemp, "mAvatar": { "image": indexConstants.MEMBER_IMG_DEFAULT, "color": background } }
                    editMember(inforUpdate);

                }

                changePassword({ "oldPassword": mCurrentPass, "newPassword": mNewPass });

            }

        } else {

            if (avatarType === "") {

                const inforUpdate = { ...inforUpdateTemp, "mAvatar": member.mAvatar }
                editMember(inforUpdate);

            } else if (avatarType === "camera" && mAvatar) {

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
                    const inforUpdate = { ...inforUpdateTemp, "mAvatar": { "image": imgUrl } }
                    editMember(inforUpdate);
                });

            } else {

                let background;
                if (avatarType === "camera") {
                    background = "pink"
                } else {
                    background = avatarType;
                }

                const inforUpdate = { ...inforUpdateTemp, "mAvatar": { "image": indexConstants.MEMBER_IMG_DEFAULT, "color": background } }
                editMember(inforUpdate);

            }

        }

    }

    handleDeleteMember = () => {

        const { deleteMember } = this.props;
        const { member } = this.props.location.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        let mID;

        if (member.mEmail !== inforLogin.user.mEmail) {

            mID = member._id;

        }

        deleteMember(mID);

    }

    render() {

        const {
            
            mRole,
            mIsAdmin,
            mNewPass,
            fPassword,
            isSetPass,
            avatarType,
            errorNewPass,
            mCurrentPass,
            mConfirmPass,
            stateNewPass,
            currentUrlImg,
            emailResetPass,
            errorConfirmPass,
            stateCurrentPass,
            stateConfirmPass,
            errorCurrentPass,
            stateEmailResetPass,
            errorEmailResetPass,
            stateFamilyPassword,
            errorFamilyPassword,
            visibleResetFamilyPassword,
            visibleRequestResetPassword
        } = this.state;

        let Avatar;
        let isChanged = false;
        const { member } = this.props.location.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { user } = inforLogin;

        console.log(user)
        console.log(inforLogin.token);

        if (member.mEmail === user.mEmail) {
            isChanged = true;
        }

        if (avatarType === "") {
            if (!member.mAvatar.color) {
                Avatar = () => (<img src={member.mAvatar.image} className="img-profile" />)
            } else {
                Avatar = () => (<img src={member.mAvatar.image} className="img-profile" style={{ backgroundColor: member.mAvatar.color }} />)
            }

        } else if (avatarType === "camera") {
            Avatar = () => (
                <div className="container-profile-img">
                    <img src={currentUrlImg} className="img-profile" />
                    <input onChange={this.handleChangeImg} type="file" className="input-profile-img" />
                </div>
            )

        } else {
            Avatar = () => (<img src={profileImg} className="img-profile" style={{ backgroundColor: avatarType }} />)
        }

        return (

            <Layout style={{ minHeight: '100vh' }}>

                <DashboardMenu menuItem="1" />

                <Layout className="site-layout">

                    <Header className="site-layout-background">

                        <Row style={{ textAlign: "center" }}>
                            <Col flex="30px"> <Button onClick={this.handleClickBack} size="large" style={{ marginLeft: "10px" }} > <LeftOutlined /> </Button> </Col>
                            <Col flex="auto"> <div className="title-header">My Account</div> </Col>
                        </Row>

                    </Header>

                    <Content className="site-layout-background" style={{ margin: 40 }}>

                        <div className="my-account-container">

                            <div className="form-my-account">

                                <Row justify="center" align="middle">

                                    <Col span={24}>

                                        <Form
                                            onFinish={this.handleSubmit} size="large"
                                            initialValues={{ "mName": member.mName, "mEmail": member.mEmail, "mAge": member.mAge }}
                                        >

                                            <Form.Item style={{ textAlign: "center", marginTop: 20 }}> <Avatar /> </Form.Item>

                                            <Form.Item>
                                                <Radio.Group
                                                    onChange={(e) => (this.setState({ avatarType: e.target.value }))}
                                                    style={{ display: "flex", justifyContent: "space-between" }}
                                                >
                                                    <Radio.Button value="camera" className="avatar camera-avatar"> <i className="fa fa-camera camera-icon" aria-hidden="true" /> </Radio.Button>
                                                    <Radio.Button value="#f7c2c1" className="avatar avatar1" style={{ backgroundColor: "#f7c2c1" }}></Radio.Button>
                                                    <Radio.Button value="#fcefc3" className="avatar avatar2" style={{ backgroundColor: "#fcefc3" }}></Radio.Button>
                                                    <Radio.Button value="#fadec2" className="avatar avatar3" style={{ backgroundColor: "#fadec2" }}></Radio.Button>
                                                    <Radio.Button value="#e4cce2" className="avatar avatar4" style={{ backgroundColor: "#e4cce2" }}></Radio.Button>
                                                    <Radio.Button value="#d3dff1" className="avatar avatar5" style={{ backgroundColor: "#d3dff1" }}></Radio.Button>
                                                    <Radio.Button value="#9dcc80" className="avatar avatar6" style={{ backgroundColor: "#9dcc80" }}></Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item name="mName" rules={[{ required: true, message: 'Please input your name!' }]}>
                                                <Input type="text" placeholder="Name" prefix={<i className="fa fa-user" aria-hidden="true"></i>} />
                                            </Form.Item>

                                            <Form.Item name="mEmail" rules={[{ required: true, message: 'Please input your email!' }]} >
                                                <Input placeholder="Email" type="text" prefix={<i className="fa fa-envelope" aria-hidden="true"></i>} />
                                            </Form.Item>

                                            <Form.Item name="mAge" rules={[{ required: true, message: 'Please input your Age!' }]}>
                                                <Input type="number" placeholder="Age" prefix={<i className="fa fa-birthday-cake" aria-hidden="true"></i>} />
                                            </Form.Item>

                                            <Form.Item>
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={16}>
                                                        <Select defaultValue={mRole} onChange={(value => (this.setState({ mRole: value })))} >
                                                            <Select.Option value="Cha">Cha</Select.Option>
                                                            <Select.Option value="Mẹ">Mẹ</Select.Option>
                                                            <Select.Option value="Anh Trai">Anh Trai</Select.Option>
                                                            <Select.Option value="Chị Gái">Chị Gái </Select.Option>
                                                            <Select.Option value="Con Trai">Con Trai</Select.Option>
                                                        </Select>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Checkbox
                                                            checked={mIsAdmin} style={{ float: "right", lineHeight: 3 }}
                                                            onChange={(e) => (this.setState({ mIsAdmin: e.target.checked }))}
                                                        > Admin </Checkbox>
                                                    </Col>
                                                </Row>
                                            </Form.Item>

                                            <Form.Item >
                                                <Checkbox disabled={!isChanged} onChange={this.handleClickSetPassword}>
                                                    <span style={{ fontSize: "18px" }}> <LockOutlined /> Set personal password </span>
                                                </Checkbox>
                                            </Form.Item>

                                            <Form.Item validateStatus={stateCurrentPass} help={errorCurrentPass} >
                                                <Input
                                                    name="mCurrentPass" value={mCurrentPass} onChange={this.handleChangeInput}
                                                    placeholder="current password" type="password" disabled={!isSetPass}
                                                />
                                            </Form.Item>

                                            <Form.Item validateStatus={stateNewPass} help={errorNewPass} >
                                                <Input
                                                    name="mNewPass" value={mNewPass} onChange={this.handleChangeInput}
                                                    placeholder="new password" type="password" disabled={!isSetPass}
                                                />
                                            </Form.Item>

                                            <Form.Item validateStatus={stateConfirmPass} help={errorConfirmPass}>
                                                <Input
                                                    name="mConfirmPass" value={mConfirmPass} onChange={this.handleChangeInput}
                                                    placeholder="confirm password" type="password" disabled={!isSetPass}
                                                />
                                            </Form.Item>

                                            <Form.Item>
                                                { (member.mEmail !== user.mEmail && user.mIsAdmin) ?
                                                    <div onClick={this.showBoxResetFamilyPassword} style={{float: "left"}} className="login-form-forgot title-forgot"> Reset family password </div>
                                                    :
                                                    null
                                                }
                                                { member.mEmail === user.mEmail ?
                                                    <div onClick={this.showBoxRequestResetPassword} className="login-form-forgot title-forgot"> Forgot password? </div> 
                                                    :
                                                    null
                                                }
                                            </Form.Item>
                                                
                                            <Modal
                                                onOk={this.handleSendRequestResetPassword}
                                                title="Please input email to reset password!"
                                                onCancel={this.handleCancelRequestResetPassword}
                                                closable={false} visible={visibleRequestResetPassword}
                                                footer={[
                                                    <Button key="back" onClick={this.handleCancelRequestResetPassword}> Cancel </Button>,
                                                    <Button key="submit" type="primary" onClick={this.handleSendRequestResetPassword}> Submit </Button>
                                                ]}
                                            >
                                                <Form.Item validateStatus={stateEmailResetPass} help={errorEmailResetPass}>
                                                    <Input
                                                        name="emailResetPass" value={emailResetPass} onChange={this.handleChangeInput}
                                                        prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" type="email"
                                                    />
                                                </Form.Item>
                                            </Modal>

                                            <Modal
                                                title="Please input family password!"
                                                onOk={this.handleSendResetFamilyPassword}
                                                onCancel={this.handleCancelResetFamilyPassword}
                                                closable={false} visible={visibleResetFamilyPassword}
                                                footer={[
                                                    <Button key="back" onClick={this.handleCancelResetFamilyPassword}> Cancel </Button>,
                                                    <Button key="submit" type="primary" onClick={this.handleSendResetFamilyPassword}> Submit </Button>
                                                ]}
                                            >
                                                <Form.Item validateStatus={stateFamilyPassword} help={errorFamilyPassword}>
                                                    <Input
                                                        name="fPassword" value={fPassword} onChange={this.handleChangeInput}
                                                        prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" size="large" type="password"
                                                    />
                                                </Form.Item>
                                            </Modal>

                                            <Form.Item>
                                                <Row>
                                                    <Col span={11}> <Button className="delete-button" onClick={this.handleDeleteMember} > Delete </Button> </Col>
                                                    <Col span={11} offset={2}> <Button className="save-button" type="primary" htmlType="submit" > Save </Button> </Col>
                                                </Row>
                                            </Form.Item>

                                        </Form>
                                    
                                    </Col>
                               
                                </Row>
                            
                            </div>

                            </div>

                    </Content>

                        <Footer style={{ textAlign: 'center' }}></Footer>

                </Layout>

                </Layout>
        );
    }
}

const actionCreators = {
    editMember: memberActions.editMember, 
    deleteMember: memberActions.deleteMember,
    changePassword: memberActions.changePassword,
    resetFamilyPassword: familyActions.resetFamilyPassword,
    requestResetPassword: memberActions.requestResetPassword
}

export default connect(null, actionCreators)(MyAccount);