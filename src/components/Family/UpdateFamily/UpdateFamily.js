import React from "react";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { LeftOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Button, Form, Input, Checkbox, Modal, Spin } from "antd";

import "./UpdateFamily.css";
import history from "../../../helpers/history";
import { storage } from "../../../helpers/firebaseConfig";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { alertActions } from "../../../actions/alert.actions";
import { familyActions } from "../../../actions/family.actions";
import { memberActions } from "../../../actions/member.actions";

const { Header, Content, Footer } = Layout;

class UpdateFamily extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            newPass: "",
            fImage: null,
            visible: false,
            currentPass: "",
            confirmPass: "",
            isSetPass: false,
            stateNewPass: "",
            currentUrlImg: "",
            emailResetPass: "",
            errorNewPass: null,
            stateCurrentPass: "",
            stateConfirmPass: "",
            errorCurrentPass: null,
            errorConfirmPass: null,
            errorEmailResetPass: null,
            stateEmailResetPass: "error"

        }
    }

    handleClickBack = () => {
        history.push("/family/setting");
    }

    showBoxInputEmail = () => {
        this.setState({ visible: true });
    };

    handleSend = (e) => {

        const { requestResetPassword } = this.props;
        const { stateEmailResetPass, emailResetPass } = this.state;

        if (stateEmailResetPass === "") {
            this.setState({ visible: false });
            requestResetPassword({ "email": emailResetPass, "type": "family" });
        }
    };

    handleCancel = (e) => {
        this.setState({ visible: false });
    };

    handleChangeInput = (e) => {

        const { name, value } = e.target;
        let stateCurrentPass, stateNewPass, stateConfirmPass;
        let errorCurrentPass, errorNewPass, errorConfirmPass;

        if (name === "currentPass") {
            if (value === "") {
                stateCurrentPass = "error";
                errorCurrentPass = "Please input your current pass";
                this.setState({ stateCurrentPass, errorCurrentPass, currentPass: value });
            } else {
                this.setState({ stateCurrentPass: "", errorCurrentPass: null, currentPass: value });
            }
        }

        if (name === "newPass") {
            if (value === "") {
                stateNewPass = "error";
                errorNewPass = "Please input your new pass";
                this.setState({ stateNewPass, errorNewPass, newPass: value });
            } else {
                this.setState({ stateNewPass: "", errorNewPass: null, newPass: value });
            }
        }

        if (name === "confirmPass") {

            const { newPass } = this.state;
            if (value === "" || value !== newPass) {
                stateConfirmPass = "error";
                errorConfirmPass = "Please input your confirm pass";
                this.setState({ stateConfirmPass, errorConfirmPass, confirmPass: value });
            } else {
                this.setState({ stateConfirmPass: "", errorConfirmPass: null, confirmPass: value });
            }
        }
        if (name === "emailResetPass") {

            if (value !== "") {
                this.setState({ emailResetPass: value, stateEmailResetPass: "", errorEmailResetPass: null });
            } else {
                this.setState({ emailResetPass: value, stateEmailResetPass: "error", errorEmailResetPass: "Please input your email" });
            }
        }
    }

    handleClickSetPassword = (e) => {

        if (e.target.checked) {
            this.setState({ stateNewPass: "error", stateCurrentPass: "error", stateConfirmPass: "error", isSetPass: e.target.checked });
        } else {

            this.setState({
                newPass: "",
                currentPass: "",
                confirmPass: "",
                stateNewPass: "",
                errorNewPass: null,
                stateCurrentPass: "",
                stateConfirmPass: "",
                errorCurrentPass: null,
                errorConfirmPass: null,
                isSetPass: e.target.checked
            });

        }

    }

    handleChangeImg = (e) => {
        this.setState({ 
            fImage: e.target.files[0], 
            currentUrlImg: URL.createObjectURL(e.target.files[0]) 
        });
    }

    handleSubmit = (fieldsValue) => {

        const { fImage, isSetPass, stateNewPass, stateCurrentPass, stateConfirmPass } = this.state;
        const { updateFamily, alertError } = this.props;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { user } = inforLogin;

        if (fImage === null && user.fName === fieldsValue.fName && !isSetPass) {
            alertError("Không có thay đổi");
        } else if (fImage !== null || user.fName !== fieldsValue.fName) {
            if (fImage === null) {
                updateFamily({ "fName": fieldsValue.fName, "fImage": user.fImage });
            } else {
                const uploadTask = storage.ref().child(`images/${fImage.name}`).put(fImage);
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
                    const urlImg = await uploadTask.snapshot.ref.getDownloadURL();
                    updateFamily({ "fName": fieldsValue.fName, "fImage": urlImg });
                });
            }
        }

        if (isSetPass) {
            if (stateNewPass === "" && stateCurrentPass === "" && stateConfirmPass === "") {
                const { changePasswordFamily } = this.props;
                const { currentPass, newPass } = this.state;
                changePasswordFamily({ "oldPassword": currentPass, "newPassword": newPass });
            }
        }
    }

    render() {

        const {
           
            newPass,
            visible,
            isSetPass,
            currentPass,
            confirmPass,
            stateNewPass,
            errorNewPass,
            currentUrlImg,
            emailResetPass,
            stateCurrentPass,
            stateConfirmPass,
            errorCurrentPass,
            errorConfirmPass,
            stateEmailResetPass,
            errorEmailResetPass,
            
        } = this.state;

        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { user } = inforLogin;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="site-layout-background">
                        <Row style={{ textAlign: "center" }}>
                            <Col flex="30px">
                                <Button onClick={this.handleClickBack} size="large" style={{ marginLeft: "10px" }} > <LeftOutlined /> </Button>
                            </Col>
                            <Col flex="auto">
                                <div className="title-header">Family Account</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content className="site-layout-background" style={{ margin: 40 }}>
                        <div className="family-account-container">
                            <div className="form-family-account">
                                <Row justify="center" align="middle">
                                    <Col span={24}>

                                        <Form initialValues={{ "fName": user.fName }} size="large" onFinish={this.handleSubmit} >

                                            <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
                                                <div className="container-family-img">
                                                    {currentUrlImg === "" ? <img src={user.fImage} className="family-img" /> : <img src={currentUrlImg} className="family-img" />}
                                                    <input onChange={this.handleChangeImg} type="file" className="input-family-img" />
                                                </div>
                                            </Form.Item>

                                            <Form.Item name="fName" rules={[{ required: true, message: 'Please input family name!' }]}>
                                                <Input prefix={<i className="fa fa-user" aria-hidden="true"></i>} type="text" />
                                            </Form.Item>

                                            <Form.Item >
                                                <Checkbox onChange={this.handleClickSetPassword}>
                                                    <span style={{ fontSize: "18px" }}> <LockOutlined /> Set family password </span>
                                                </Checkbox>
                                            </Form.Item>

                                            <Form.Item validateStatus={stateCurrentPass} help={errorCurrentPass} >
                                                <Input
                                                    name="currentPass" value={currentPass} onChange={this.handleChangeInput}
                                                    placeholder="current password" type="password" disabled={!isSetPass}
                                                />
                                            </Form.Item>

                                            <Form.Item validateStatus={stateNewPass} help={errorNewPass} >
                                                <Input
                                                    name="newPass" value={newPass} onChange={this.handleChangeInput}
                                                    placeholder="new password" type="password" disabled={!isSetPass}
                                                />
                                            </Form.Item>

                                            <Form.Item validateStatus={stateConfirmPass} help={errorConfirmPass}>
                                                <Input
                                                    name="confirmPass" value={confirmPass} onChange={this.handleChangeInput}
                                                    placeholder="confirm password" type="password" disabled={!isSetPass}
                                                />
                                            </Form.Item>

                                            <div onClick={this.showBoxInputEmail} className="login-form-forgot title-forgot"> Forgot password </div>
                                            
                                            <Modal
                                                onOk={this.handleSend}
                                                onCancel={this.handleCancel}
                                                closable={false} visible={visible}
                                                title="Please input email to reset password!"
                                                footer={[
                                                    <Button key="back" onClick={this.handleCancel}> Cancel </Button>,
                                                    <Button key="submit" type="primary" onClick={this.handleSend}> Submit </Button>
                                                ]}
                                            >
                                                <Form.Item validateStatus={stateEmailResetPass} help={errorEmailResetPass}>
                                                    <Input
                                                        name="emailResetPass" value={emailResetPass} onChange={this.handleChangeInput}
                                                        prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" type="email"
                                                    />
                                                </Form.Item>
                                            </Modal>
                                            <br /><br />
                                            <Form.Item style={{ textAlign: "center" }}>
                                                <Button type="primary" htmlType="submit" className="login-form-button"> Save </Button>
                                                {this.props.changingFamilyPassword && !this.props.changedFamilyPassword &&
                                                    <Spin tip="Loading..." />
                                                }
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

const mapStateToProps = (state) => {
    return { 
        changedFamilyPassword: state.family.changedFamilyPassword,
        changingFamilyPassword: state.family.changingFamilyPassword
    }
}

const actionCreators = {
    alertError: alertActions.error,
    updateFamily: familyActions.updateFamily,
    changePasswordFamily: familyActions.changePasswordFamily,
    requestResetPassword: memberActions.requestResetPassword
}

export default connect(mapStateToProps, actionCreators)(UpdateFamily);