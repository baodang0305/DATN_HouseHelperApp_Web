import React from "react";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { LeftOutlined, LockOutlined, UserOutlined, PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Button, Select, Checkbox, Modal, Divider } from 'antd';

import "./MyAccount.css";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from "../../../actions/family.actions";
import { memberActions } from "../../../actions/member.actions";
import { indexConstants } from "../../../constants/index.constants";
import AvatarsDefault from "../../Common/AvatarsDefault/AvatarsDefault";
import { alertActions } from "../../../actions/alert.actions";
import Loading from "../../Common/Loading/Loading";

const { Option } = Select;
const { Header, Footer, Content } = Layout;

class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mRole: "",
            mAvatar: null,
            avatarType: "",
            mIsAdmin: false,
            isSetPass: false,
            mNewPass: "",
            mConfirmPass: "",
            mCurrentPass: "",
            fPassword: "",
            emailResetPP: "",
            showResetFPModal: false,
            showResetPPModal: false,
            currentUrlImg: indexConstants.UPLOAD_IMG,
            itemRole: "",
            itemsRole: ["Cha", "Mẹ", "Anh trai", "Chị gái"],
        }
    }

    componentWillMount() {
        const { member } = this.props.location.state;
        let { itemsRole } = this.state;
        const indexRoleItem = itemsRole.findIndex(element => element.toLowerCase() === member.mRole.toLowerCase());
        itemsRole = indexRoleItem === -1 ? [...itemsRole, member.mRole] : itemsRole;
        this.setState({ itemsRole, mRole: member.mRole, mIsAdmin: member.mIsAdmin });
    }

    addItemRole = () => {
        let { itemRole, itemsRole } = this.state;
        if (itemRole !== "") {
            const indexRoleItem = itemsRole.findIndex(element => element.toLowerCase() === itemRole.toLowerCase());
            itemsRole = indexRoleItem === -1 ? [...itemsRole, itemRole] : itemsRole;
            this.setState({ itemsRole, itemRole: "" });
        }
    }

    handleClickBack = () => {
        const { fromSetting, member } = this.props.location.state;
        fromSetting
            ? history.push("/family/setting")
            : history.push({ pathname: "/family/member", search: `?id=${member._id}`, state: { member } })
    }

    handleSubmitResetPP = e => {
        const { requestResetPassword } = this.props;
        const { emailResetPP } = this.state;
        requestResetPassword({ "email": emailResetPP, "type": "member" });
        this.setState({ showResetPPModal: false });
    };

    handleSubmitResetFP = e => {
        const { resetFamilyPassword } = this.props;
        const { fPassword } = this.state;
        const { member } = this.props.location.state;
        resetFamilyPassword({ "fPassword": fPassword, "mID": member._id });
        this.setState({ showResetFPModal: false });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleChangeImg = (e) => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            mAvatar: e.target.files[0]
        });
    }

    handleSubmit = (fieldsValue) => {

        const { editMember, changePassword } = this.props;
        const { fromSetting, member } = this.props.location.state;
        const {
            isSetPass, mCurrentPass, mNewPass, mConfirmPass,
            avatarType, mAvatar, mRole, mIsAdmin,
        } = this.state;

        const inforUpdateTemp = {
            mRole: mRole,
            member: member,
            mIsAdmin: mIsAdmin,
            isSetPass: isSetPass,
            mAge: fieldsValue.mAge,
            fromSetting: fromSetting,
            mName: fieldsValue.mName,
            mEmail: fieldsValue.mEmail,
        }

        if (isSetPass) {
            if (mNewPass !== mConfirmPass) {
                const { alertError } = this.props;
                return alertError("Mật khẩu xác nhận không trùng khớp!");
            }
            if (mCurrentPass !== "" && mNewPass !== "" && mConfirmPass !== "" && mNewPass === mConfirmPass) {
                changePassword({ "oldPassword": mCurrentPass, "newPassword": mNewPass });
            }
        }

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
            const background = avatarType === "camera" ? "pink" : avatarType;
            const inforUpdate = { ...inforUpdateTemp, "mAvatar": { "image": indexConstants.MEMBER_IMG_DEFAULT, "color": background } }
            editMember(inforUpdate);
        }
    }

    handleDeleteMember = () => {
        const { deleteMember } = this.props;
        const { member } = this.props.location.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const mID = member.mEmail !== inforLogin.user.mEmail ? member._id : null;
        deleteMember(mID);
    }

    handleSelectAvatars = (value) => {
        this.setState({ avatarType: value });
    }

    render() {

        const {
            mRole, mIsAdmin, mNewPass, fPassword, isSetPass, itemsRole, avatarType, itemRole,
            mCurrentPass, mConfirmPass, currentUrlImg, emailResetPP, showResetPPModal, showResetFPModal,
        } = this.state;

        const { member } = this.props.location.state;
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

        const renderAvatar = () => {
            if (avatarType === "") {
                return <img className="img-account" src={member.mAvatar.image} style={{ backgroundColor: member.mAvatar.color }} />
            } else if (avatarType === "camera") {
                return (
                    <div className="img-account-container">
                        <img src={currentUrlImg} className="img-account" />
                        <input onChange={this.handleChangeImg} type="file" className="input-img-account" />
                    </div>
                )
            } else {
                return <img src={profileImg} className="img-account" style={{ backgroundColor: avatarType }} />
            }
        }

        return (

            <Layout style={{ position: 'relative' }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="header-container">
                        <div className="left-header-my-account-container">
                            <div onClick={this.handleClickBack} className="header__btn-link">
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                        </div>
                        <div className="center-header-my-account-container">Tài Khoản Của Tôi</div>
                        <div style={{ width: "20%" }}></div>
                    </Header>
                    <Content className="content-my-account">
                        <Form
                            className="my-account-form"
                            onFinish={this.handleSubmit} size="large"
                            initialValues={{ "mName": member.mName, "mEmail": member.mEmail, "mAge": member.mAge }}
                        >
                            <Form.Item style={{ textAlign: "center", marginTop: 20 }}> {renderAvatar()} </Form.Item>
                            <Form.Item>
                                <AvatarsDefault onChange={this.handleSelectAvatars} />
                            </Form.Item>
                            <Form.Item name="mName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                <Input type="text" placeholder="Name" prefix={<i className="fa fa-user" aria-hidden="true"></i>} />
                            </Form.Item>
                            <Form.Item name="mEmail" rules={[{ required: true, message: 'Vui lòng nhập email!' }]} >
                                <Input placeholder="Email" type="text" prefix={<i className="fa fa-envelope" aria-hidden="true"></i>} />
                            </Form.Item>
                            <Form.Item name="mAge" rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}>
                                <Input type="number" placeholder="Age" prefix={<i className="fa fa-birthday-cake" aria-hidden="true"></i>} />
                            </Form.Item>
                            <Form.Item >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Select
                                        style={{ width: '70%' }}
                                        defaultValue={mRole}
                                        onChange={(key => (this.setState({ mRole: key })))}
                                        dropdownRender={menu => (
                                            <div>
                                                {menu}
                                                <Divider style={{ margin: "4px 0" }} />
                                                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                    <Input style={{ flex: 'auto' }} name="itemRole" value={itemRole} onChange={this.handleInputChange} />
                                                    <a
                                                        style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                        onClick={this.addItemRole}
                                                    >
                                                        <PlusOutlined /> Thêm vai trò
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    >
                                        {itemsRole.map(item => (
                                            <Option key={item}>{item}</Option>
                                        ))}
                                    </Select>
                                    <div style={{ width: "30%" }}>
                                        <Checkbox
                                            checked={mIsAdmin} style={{ float: "right", lineHeight: 3 }}
                                            onChange={(e) => (this.setState({ mIsAdmin: e.target.checked }))}
                                        > Admin </Checkbox>
                                    </div>
                                </div>
                            </Form.Item>
                            {member.mEmail === inforLogin.user.mEmail &&
                                <>
                                    <Form.Item >
                                        <Checkbox onChange={(e) => this.setState({ isSetPass: e.target.checked })}>
                                            <span style={{ fontSize: "18px" }}> <LockOutlined /> Đặt lại mật khẩu cá nhân </span>
                                        </Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        name={isSetPass ? "mCurrentPass" : null}
                                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                                    >
                                        <Input
                                            name="mCurrentPass" value={mCurrentPass} onChange={this.handleInputChange}
                                            placeholder="Mật khẩu hiện tại" type="password" disabled={!isSetPass}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name={isSetPass ? "mNewPass" : null}
                                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
                                    >
                                        <Input
                                            name="mNewPass" value={mNewPass} onChange={this.handleInputChange}
                                            placeholder="Mật khẩu mới" type="password" disabled={!isSetPass}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name={isSetPass ? "mConfirmPass" : null}
                                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu xác nhận" }]}
                                    >
                                        <Input
                                            name="mConfirmPass" value={mConfirmPass} onChange={this.handleInputChange}
                                            placeholder="Mật khẩu xác nhận" type="password" disabled={!isSetPass}
                                        />
                                    </Form.Item>
                                </>
                            }
                            <Form.Item>
                                {(member.mEmail !== inforLogin.user.mEmail && inforLogin.user.mIsAdmin) &&
                                    <div
                                        onClick={() => this.setState({ showResetFPModal: true })} className="title-forgot"
                                    > Đặt lại mật khẩu gia đình </div>
                                }
                                {member.mEmail === inforLogin.user.mEmail &&
                                    <div
                                        onClick={() => this.setState({ showResetPPModal: true })} className="title-forgot"
                                    > Quên mật khẩu? </div>
                                }
                            </Form.Item>

                            <Modal title={null} footer={null} closable={false} visible={showResetPPModal} width={400}>
                                <div className="title-reset-personal-pass-form" >
                                    <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                                    &nbsp;
                                    Vui lòng nhập email để đặt lại password!
                                </div>
                                <Form onFinish={this.handleSubmitResetPP}>
                                    <Form.Item name="emailResetPP" rules={[{ required: true, message: "Vui lòng nhập email" }]} >
                                        <Input
                                            name="emailResetPP" value={emailResetPP} onChange={this.handleInputChange}
                                            prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" type="email"
                                        />
                                    </Form.Item>
                                    <div className="button-modal-my-account-container">
                                        <Button key="close" onClick={() => this.setState({ showResetPPModal: false })}> Đóng </Button>
                                        &emsp;
                                        <Button key="submit" type="primary" htmlType="submit"> Gửi </Button>
                                    </div>
                                </Form>
                            </Modal>

                            <Modal title={null} footer={null} closable={false} visible={showResetFPModal} width={400}>
                                <div className="title-reset-family-pass-form" >
                                    <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                                    &nbsp;
                                    Vui lòng nhập lại mật khẩu gia đình hiện tại!
                                </div>
                                <Form onFinish={this.handleSubmitResetFP}>
                                    <Form.Item name="familyPassword" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
                                        <Input
                                            name="fPassword" value={fPassword} onChange={this.handleInputChange}
                                            prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Mật khẩu" size="large" type="password"
                                        />
                                    </Form.Item>
                                    <div className="button-modal-my-account-container">
                                        <Button key="close" onClick={() => this.setState({ showResetFPModal: false })}> Đóng </Button>
                                        &emsp;
                                        <Button key="submit" type="primary" htmlType="submit"> Gửi </Button>
                                    </div>
                                </Form>
                            </Modal>

                            <Form.Item >
                                <div className="button-my-account-container">
                                    <Button className="button-item-my-account" type='primary' ghost onClick={this.handleDeleteMember} > Xóa </Button>
                                    <Button className="button-item-my-account" type="primary" htmlType="submit" > Lưu </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
                {this.props.changingPassword && !this.props.changedPassword && <Loading />}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        changedPassword: state.family.changedPassword,
        changingPassword: state.family.changingPassword
    }
}

const actionCreators = {
    editMember: memberActions.editMember,
    deleteMember: memberActions.deleteMember,
    changePassword: memberActions.changePassword,
    resetFamilyPassword: familyActions.resetFamilyPassword,
    requestResetPassword: memberActions.requestResetPassword,
    alertError: alertActions.error,
}

export default connect(mapStateToProps, actionCreators)(MyAccount);