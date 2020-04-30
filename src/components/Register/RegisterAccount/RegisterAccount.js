import React from "react";
import { connect } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Row, Col, Button, Radio, Input, Select, Spin, Divider } from "antd";

import "./RegisterAccount.css";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import { familyActions } from "../../../actions/family.actions";
import { indexConstants } from "../../../constants/index.constants";

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
            nameAddRole: "",
            avatarType: "#f7c2c1",
            currentUrlImg: indexConstants.UPLOAD_IMG,
            itemsRole: ["Cha", "Mẹ", "Anh trai", "Chị gái"]
        }
    }

    handleChangeImg = (e) => {
        this.setState({ currentUrlImg: URL.createObjectURL(e.target.files[0]), mAvatar: e.target.files[0] });
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleClickBack = () => {
        history.push("/create-family");
    }

    addItemRole = () => {
        const { nameAddRole, itemsRole } = this.state;
        if (nameAddRole !== "") {
            const itemsRoleFilter = itemsRole.filter(element => {
                return element.toLowerCase().includes(nameAddRole.toLowerCase())
            })
            if ( itemsRoleFilter.length === 0 ) {
                this.setState({ itemsRole: [...itemsRole, nameAddRole ] });
            }
            this.setState({ nameAddRole: "" });
        }
    }

    handleSubmit = () => {

        const { fName, fPassword, fImgUrl } = history.location.state;
        const { mName, mEmail, mAvatar, mRole, mAge, avatarType } = this.state;
        const { createFamily } = this.props;
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
                    const inforCreate = { fName, fPassword, "fImage": fImgUrl, mName, "mAvatar": { "image": mImgUrl }, mEmail, mAge, mRole }
                    createFamily(inforCreate);
                }
            );

        } else {

            let background;
            if (avatarType === "camera") {
                background = "#f7c2c1"
            } else {
                background = avatarType;
            }

            const inforCreate = {
                mAge,
                mRole,
                fName,
                mName,
                mEmail,
                fPassword,
                "fImage": fImgUrl,
                "mAvatar":
                {
                    "color": background,
                    "image": indexConstants.MEMBER_IMG_DEFAULT
                }
            }
            createFamily(inforCreate);
        }
    }

    render() {

        const { mName, mEmail, mAge, mRole, avatarType, currentUrlImg, nameAddRole, itemsRole } = this.state;

        return (

            <div className="register-account-container">

                <div className="register-account-form">

                    <Row justify="center" align="middle" >

                        <Col md={20}>

                            <Form
                                onFinish={this.handleSubmit}
                                size="large" initialValues={{ remember: true }}
                            >

                                <div className="title-create-account"> Đăng Kí Tài Khoản</div>

                                <Form.Item style={{ textAlign: "center", marginTop: 10 }}>
                                    {avatarType === "camera" ?
                                        (
                                            <div className="container-profile-img">
                                                <img src={currentUrlImg} className="img-profile" />
                                                <input onChange={this.handleChangeImg} type="file" className="input-profile-img" />
                                            </div>
                                        ) : (
                                            <img src={profileImg} className="img-profile" style={{ backgroundColor: avatarType }} />
                                        )
                                    }
                                </Form.Item>

                                <Form.Item>
                                    <Radio.Group
                                        onChange={(e) => (this.setState({ avatarType: e.target.value }))}
                                        defaultValue="pink" style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <Radio.Button value="camera" className="avatar camera-avatar"> <i className="fa fa-camera camera-icon" aria-hidden="true"></i> </Radio.Button>
                                        <Radio.Button value="#f7c2c1" className="avatar avatar1" style={{ backgroundColor: "#f7c2c1" }}></Radio.Button>
                                        <Radio.Button value="#fcefc3" className="avatar avatar2" style={{ backgroundColor: "#fcefc3" }}></Radio.Button>
                                        <Radio.Button value="#fadec2" className="avatar avatar3" style={{ backgroundColor: "#fadec2" }}></Radio.Button>
                                        <Radio.Button value="#e4cce2" className="avatar avatar4" style={{ backgroundColor: "#e4cce2" }}></Radio.Button>
                                        <Radio.Button value="#d3dff1" className="avatar avatar5" style={{ backgroundColor: "#d3dff1" }}></Radio.Button>
                                        <Radio.Button value="#9dcc80" className="avatar avatar6" style={{ backgroundColor: "#9dcc80" }}></Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                    <Input
                                        name="mName" value={mName} onChange={this.handleChangeInput}
                                        type="text" placeholder="Tên" prefix={<i className="fa fa-user" aria-hidden="true"></i>}
                                    />
                                </Form.Item>

                                <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                    <Input
                                        name="mEmail" value={mEmail} onChange={this.handleChangeInput}
                                        type="text" placeholder="Email" prefix={<i className="fa fa-envelope" aria-hidden="true"></i>}
                                    />
                                </Form.Item>

                                <Form.Item name="age" rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}>
                                    <Input
                                        name="mAge" value={mAge} onChange={this.handleChangeInput}
                                        type="number" placeholder="Tuổi" prefix={<i className="fa fa-birthday-cake" aria-hidden="true"></i>}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Row style={{ width: '100%' }}>
                                        <Col span={17}>
                                            <Select
                                                defaultValue={mRole}
                                                onChange={(key => (this.setState({ mRole: key })))}
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                        <Divider style={{ margin: "4px 0" }} />
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                            <Input style={{ flex: 'auto' }} name="nameAddRole" value={nameAddRole} onChange={this.handleChangeInput} />
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
                                        </Col>
                                        <Col span={7}>
                                            <Radio style={{ float: "right", lineHeight: 3 }} defaultChecked disabled={true}> Admin </Radio>
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item style={{ textAlign: "center" }}>
                                    <Row>
                                        <Col span={11}> <Button onClick={this.handleClickBack} className="button-back" > Quay lại </Button> </Col>
                                        <Col span={11} offset={2}> <Button className="button-next" type="primary" htmlType="submit"> Đăng kí </Button> </Col>
                                    </Row>
                                    {this.props.creating && !this.props.created &&
                                        <Spin tip="Loading..." />
                                    }
                                </Form.Item>

                            </Form>

                        </Col>

                    </Row>

                </div>

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