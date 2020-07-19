import React from "react";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { LeftOutlined, LockOutlined, UserOutlined, ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Layout, Button, Form, Input, Checkbox, Modal, Spin } from "antd";

import "./UpdateFamily.css";
import history from "../../../helpers/history";
import { storage } from "../../../helpers/firebaseConfig";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { alertActions } from "../../../actions/alert.actions";
import { familyActions } from "../../../actions/family.actions";
import { memberActions } from "../../../actions/member.actions";
import Loading from "../../Common/Loading/Loading";

const { Header, Content, Footer } = Layout;

class UpdateFamily extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPass: "",
            fImage: null,
            currentPass: "",
            confirmPass: "",
            isSetPass: false,
            currentUrlImg: "",
            emailResetFP: "",
            showResetFPModal: false,
        }
    }

    handleClickBack = () => {
        history.push("/family/setting");
    }

    handleSend = (e) => {
        const { requestResetPassword } = this.props;
        const { emailResetFP } = this.state;
        this.setState({ showResetFPModal: false });
        requestResetPassword({ "email": emailResetFP, "type": "family" });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleChangeImg = (e) => {
        this.setState({
            fImage: e.target.files[0],
            currentUrlImg: URL.createObjectURL(e.target.files[0])
        });
    }

    handleSubmit = (fieldsValue) => {

        const { updateFamily, alertError, changePasswordFamily } = this.props;
        const { fImage, isSetPass, currentPass, newPass, confirmPass } = this.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

        if (fImage === null && inforLogin.user.fName === fieldsValue.fName && !isSetPass) {
            return alertError("Không có thay đổi!");
        }

        if (isSetPass && newPass !== confirmPass) {
            return alertError("Mật khẩu xác nhận không khớp!")
        }

        if (fImage) {
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
        } else {
            updateFamily({ "fName": fieldsValue.fName, "fImage": inforLogin.user.fImage });
        }
        isSetPass && changePasswordFamily({ "oldPassword": currentPass, "newPassword": newPass });
    }

    render() {

        const { newPass, showResetFPModal, isSetPass, currentPass, confirmPass, currentUrlImg, emailResetFP } = this.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

        return (
            <Layout style={{ position: 'relative', height: "100vh" }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="header-container">
                        <div className="left-header-update-family-container">
                            <div onClick={this.handleClickBack} className="header__btn-link">
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                        </div>
                        <div className="center-header-update-family-container"> Tài khoản gia đình </div>
                        <div style={{ width: "20%" }}></div>
                    </Header>
                    <Content className="content-update-family">
                        <Form
                            onFinish={this.handleSubmit}
                            initialValues={{ "fName": inforLogin.user.fName }}
                            size="large" className="update-family-form" >
                            <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
                                <div className="img-update-family-container">
                                    <img src={currentUrlImg === "" ? inforLogin.user.fImage : currentUrlImg} className="img-update-family" />
                                    <input onChange={this.handleChangeImg} type="file" className="input-img-update-family" />
                                </div>
                            </Form.Item>

                            <Form.Item name="fName" rules={[{ required: true, message: 'Vui lòng nhập tên gia đình!' }]}>
                                <Input prefix={<i className="fa fa-user" aria-hidden="true"></i>} type="text" />
                            </Form.Item>

                            <Form.Item >
                                <Checkbox onChange={(e) => this.setState({ isSetPass: e.target.checked })}>
                                    <span style={{ fontSize: "18px" }}> <LockOutlined /> Đặt lại mật khẩu gia đình </span>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item
                                name={isSetPass ? "currentPass" : null}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                            >
                                <Input
                                    name="currentPass" value={currentPass} onChange={this.handleInputChange}
                                    placeholder="Mật khẩu hiện tại" type="password" disabled={!isSetPass}
                                />
                            </Form.Item>

                            <Form.Item
                                name={isSetPass ? "newPass" : null}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                            >
                                <Input
                                    name="newPass" value={newPass} onChange={this.handleInputChange}
                                    placeholder="Mật khẩu mới" type="password" disabled={!isSetPass}
                                />
                            </Form.Item>

                            <Form.Item
                                name={isSetPass ? "confirmPass" : null}
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' }]}
                            >
                                <Input
                                    name="confirmPass" value={confirmPass} onChange={this.handleInputChange}
                                    placeholder="Mật khẩu xác nhận" type="password" disabled={!isSetPass}
                                />
                            </Form.Item>

                            <Form.Item>
                                <div onClick={() => this.setState({ showResetFPModal: true })} className="title-forgot"> Quên mật khẩu? </div>
                            </Form.Item>

                            <Modal title={null} footer={null} closable={false} visible={showResetFPModal} width={400}>
                                <div className="title-reset-family-pass-form" >
                                    <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                                    &nbsp;
                                    Vui lòng nhập email để đặt lại mật khẩu!
                                </div>
                                <Form onFinish={this.handleSubmitResetFP}>
                                    <Form.Item name="familyPassword" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
                                        <Input
                                            name="email" value={emailResetFP} onChange={this.handleInputChange}
                                            prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" type="email"
                                        />
                                    </Form.Item>
                                    <div className="button-modal-update-family-container">
                                        <Button key="close" onClick={() => this.setState({ showResetFPModal: false })}> Đóng </Button>
                                        &emsp;
                                        <Button key="submit" type="primary" htmlType="submit"> Gửi </Button>
                                    </div>
                                </Form>
                            </Modal>

                            <Form.Item >
                                <Button type="primary" htmlType="submit" style={{ width: '100%', fontSize: 18 }}> Lưu Thay Đổi </Button>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
                {this.props.changingFamilyPassword && !this.props.changedFamilyPassword && <Loading />}
            </Layout >
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