import React from "react";
import { connect } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Button, Radio, Input, Select, Spin, Divider } from "antd";

import "./RegisterAccount.css";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import { familyActions } from "../../../actions/family.actions";
import { indexConstants } from "../../../constants/index.constants";
import AvatarsDefault from "../../Common/AvatarsDefault/AvatarsDefault";
import { colors } from "../../../constants/colors";

const { Option } = Select;

class RegisterAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mAge: 20,
            mName: "",
            mEmail: "",
            mRole: "Cha",
            mAvatar: null,
            itemRole: "",
            avatarType: "#f7c2c1",
            currentUrlImg: indexConstants.UPLOAD_IMG,
            itemsRole: ["Cha", "Mẹ", "Anh trai", "Chị gái"]
        }
    }

    handleChangeImg = (e) => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            mAvatar: e.target.files[0]
        });
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleClickBack = () => {
        history.push("/create-family");
    }

    addItemRole = () => {
        let { itemRole, itemsRole } = this.state;
        if (itemRole !== "") {
            const indexRoleItem = itemsRole.findIndex(element => element.toLowerCase() === itemRole.toLowerCase())
            itemsRole = indexRoleItem === -1 ? [...itemsRole, itemRole] : itemsRole;
            this.setState({ itemRole: "", itemsRole });
        }
    }

    handleSubmit = () => {

        const { createFamily } = this.props;
        const { fName, fPassword, fImgUrl } = history.location.state;
        const { mName, mEmail, mAvatar, mRole, mAge, avatarType } = this.state;

        if (avatarType === "camera" && mAvatar) {
            const uploadTask = storage.ref(`images/${mAvatar.name}`).put(mAvatar);
            uploadTask.on('state_changed',
                (snapshot) => {

                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    const mImgUrl = await storage.ref('images').child(mAvatar.name).getDownloadURL();
                    createFamily({ fName, fPassword, fImage: fImgUrl, mName, mAvatar: { image: mImgUrl }, mEmail, mAge, mRole });
                }
            );
        } else {
            const background = avatarType === "camera" ? colors.green : avatarType;
            createFamily({
                fName, fPassword, fImage: fImgUrl, mName, mEmail, mRole, mAge,
                mAvatar: { image: indexConstants.MEMBER_IMG_DEFAULT, color: background },
            });
        }
    }

    handleSelectAvatar = (value) => {
        this.setState({ avatarType: value });
    }

    render() {
        const { mName, mEmail, mAge, mRole, avatarType, currentUrlImg, itemRole, itemsRole } = this.state;
        return (
            <div className="body-register-account">
                <div className="register-account-container">

                    <Form
                        onFinish={this.handleSubmit} className="form-register-account"
                        size="large" initialValues={{ remember: true }}
                    >
                        <div className="title-register-account"> Đăng Kí Tài Khoản</div>
                        <Form.Item >
                            <div className="form-item-register-account">
                                {avatarType === "camera"
                                    ? <div className="profile-img-account-container">
                                        <img src={currentUrlImg} className="account-img-profile" />
                                        <input onChange={this.handleChangeImg} type="file" className="input-profile-img-account" />
                                    </div>
                                    : <img src={profileImg} className="account-img-profile" style={{ backgroundColor: avatarType }} />
                                }
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <AvatarsDefault onChange={this.handleSelectAvatar} />
                        </Form.Item>
                        <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]} >
                            <Input
                                name="mName" value={mName} onChange={this.handleInputChange}
                                type="text" placeholder="Tên" prefix={<i className="fa fa-user" aria-hidden="true"></i>}
                            />
                        </Form.Item>
                        <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                            <Input
                                name="mEmail" value={mEmail} onChange={this.handleInputChange}
                                type="email" placeholder="Email" prefix={<i className="fa fa-envelope" aria-hidden="true"></i>}
                            />
                        </Form.Item>
                        <Form.Item name="age" rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}>
                            <Input
                                name="mAge" value={mAge} onChange={this.handleInputChange}
                                type="number" placeholder="Tuổi" prefix={<i className="fa fa-birthday-cake" aria-hidden="true"></i>}
                            />
                        </Form.Item>
                        <Form.Item >
                            <div className="form-item-register-account form-item-role-register-account">
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
                                <Radio style={{ width: '20%' }} defaultChecked disabled={true}> Admin </Radio>
                            </div>
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <div className="button-register-account-container">
                                <Button onClick={this.handleClickBack} className="button-item-register-account-form" > Quay lại </Button>
                                <Button className="button-item-register-account-form" type="primary" htmlType="submit"> Đăng kí </Button>
                            </div>
                            {this.props.creating && !this.props.created &&
                                <Spin tip="Loading..." style={{ margin: '20px 0px 0px 0px' }} />
                            }
                        </Form.Item>
                    </Form>
                </div>
                <div className="register-account__banner"> </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        created: state.family.created,
        creating: state.family.creating
    }
}

const actionCreators = {
    createFamily: familyActions.createFamily
}

export default connect(mapStateToProps, actionCreators)(RegisterAccount);