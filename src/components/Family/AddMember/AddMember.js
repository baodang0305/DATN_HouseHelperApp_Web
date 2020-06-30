import React from "react";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Layout, Form, Input, Button, Select, Radio, Checkbox, Spin, Divider } from 'antd';

import "./AddMember.css";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { memberActions } from "../../../actions/member.actions";
import { indexConstants } from "../../../constants/index.constants";
import AvatarsDefault from "../../Common/AvatarsDefault/AvatarsDefault";
import { colors } from "../../../constants/colors";
import Loading from "../../Common/Loading/Loading";

const { Option } = Select;
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
            itemRole: "",
            mIsAdmin: false,
            avatarType: colors.green,
            currentUrlImg: indexConstants.UPLOAD_IMG,
            itemsRole: ["Cha", "Mẹ", "Anh trai", "Chị gái"]
        }
    }

    handleInputChange = (e) => {
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

    addItemRole = () => {
        let { itemRole, itemsRole } = this.state;
        if (itemRole !== "") {
            const indexItemRole = itemsRole.findIndex(element => element.toLowerCase() === itemRole.toLowerCase());
            itemsRole = indexItemRole === -1 ? [...itemsRole, itemRole] : itemsRole;
            this.setState({ itemsRole, itemRole: "" });
        }
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
                        mAvatar: { image: downloadURL }
                    }
                    addMember(userInfor);
                });
            });

        } else {
            const background = avatarType === "camera" ? colors.green : avatarType;
            const userInfor = {
                mAge, mRole, mName, mEmail, mIsAdmin,
                mAvatar: { color: background, image: indexConstants.MEMBER_IMG_DEFAULT }
            }
            addMember(userInfor);
        }
    }

    handleSelectAvatar = (value) => {
        this.setState({ avatarType: value });
    }

    render() {

        const { avatarType, currentUrlImg, mName, mEmail, mAge, mRole, itemsRole, itemRole } = this.state;

        return (

            <Layout style={{ minHeight: '100vh', position: 'relative' }}>
                <DashboardMenu menuItem="1" />
                <Layout className="site-layout">
                    <Header className="header-container add-member__header" >
                        <div className="left-header-add-member-container">
                            <div onClick={this.handleClickBack} className="header__btn-link">
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                        </div>
                        <div className="center-header-add-member-container"> Tạo Thông Tin Thành Viên </div>

                    </Header>
                    <Content className="content-add-member" >
                        <Form onFinish={this.handleSubmit} size="large" className="add-member__form" >
                            <Form.Item style={{ textAlign: "center" }}>
                                {avatarType === "camera"
                                    ? <div className="img-add-member-container">
                                        <img src={currentUrlImg} className="img-add-member" />
                                        <input onChange={this.handleChangeImg} type="file" className="input-img-add-member" />
                                    </div>
                                    : <img src={profileImg} className="img-add-member" style={{ backgroundColor: avatarType }} />
                                }
                            </Form.Item>

                            <Form.Item>
                                <AvatarsDefault onChange={this.handleSelectAvatar} />
                            </Form.Item>

                            <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                <Input
                                    type="text" placeholder="Tên"
                                    name="mName" value={mName} onChange={this.handleInputChange}
                                    prefix={<i className="fa fa-user" aria-hidden="true" style={{ paddingRight: 5 }}></i>}
                                />
                            </Form.Item>

                            <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                <Input
                                    type="email" placeholder="Username or Email"
                                    name="mEmail" value={mEmail} onChange={this.handleInputChange}
                                    prefix={<i className="fa fa-envelope" aria-hidden="true" style={{ paddingRight: 5 }}></i>}
                                />
                            </Form.Item>

                            <Form.Item name="age" rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}>
                                <Input
                                    type="number" placeholder="Tuổi"
                                    name="mAge" value={mAge} onChange={this.handleInputChange}
                                    prefix={<i className="fa fa-birthday-cake" aria-hidden="true" style={{ paddingRight: 5 }}></i>}
                                />
                            </Form.Item>

                            <Form.Item>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ width: '65%' }}>
                                        <Select
                                            defaultValue={mRole}
                                            onChange={(key => (this.setState({ mRole: key })))}
                                            dropdownRender={menu => (
                                                <div>
                                                    {menu}
                                                    <Divider style={{ margin: "4px 0" }} />
                                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: '4px 4px' }}>
                                                        <Input style={{ flex: 'auto' }} name="itemRole" value={itemRole} onChange={this.handleInputChange} />
                                                        <a
                                                            style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer', fontSize: 14 }}
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
                                    </div>
                                    <div style={{ width: '35%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Checkbox onChange={(e) => this.setState({ mIsAdmin: e.target.checked })}> Admin</Checkbox>
                                    </div>
                                </div>
                            </Form.Item>

                            <Form.Item >
                                <Button style={{ fontSize: 18, width: '100%' }} type="primary" htmlType="submit" >Thêm Thành Viên</Button>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
                {this.props.addingMember && !this.props.addedMember && <Loading />}
            </Layout >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addedMember: state.family.addedMember,
        addingMember: state.family.addingMember
    }
}

const actionCreators = {
    addMember: memberActions.addMember
}

export default connect(mapStateToProps, actionCreators)(AddMember);