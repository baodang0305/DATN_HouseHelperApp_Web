import React from "react";
import { Form, Row, Col, Button, Radio, Input, Select } from "antd";
import { connect } from "react-redux";
import history from "../../../helpers/history";
import profileImg from "../../../assets/profile-img.png";
import { storage } from "../../../helpers/firebaseConfig";
import { familyActions } from "../../../actions/family.actions";
import { indexConstants } from "../../../constants/index.constants";
import "./RegisterAccount.css";

class RegisterAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mName: "",
            mEmail: "",
            mAge: 1,
            mRole: "Father",
            avatarType: "pink",
            currentUrlImg: "",
            mAvatar: null,
            errorMessages: {
                mName: "",
                mEmail: "",
                mAge: "",
            }
        }
    }

    handleChangeImg = (e) => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            mAvatar: e.target.files[0]
        });
    }

    handleChange = (e) => {
        const { name , value } = e.target;
        this.setState({ [name]: value });
    }

    handleChangeTypesOfImage = (e) => {
        if (e.target.value !== "camera") {
            this.setState({ mAvatar: null});
        }
        this.setState({ avatarType: e.target.value });
    }

    handleChangeRole = (value) => {
        this.setState({ mRole: value });
    }

    handleClickBack = () => {
        history.goBack();
    }

    handleClickCreate = () => {
        const { mName, mEmail, mAvatar, mRole, mAge, avatarType } = this.state;
        const { fName, fPassword, fImage } = history.location.state;
        let errorMessages = {};
        if (mName === "") {
            errorMessages.mName = "Name is required";
        } 
        if (!(new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(mEmail))) {
            errorMessages.mEmail = "Email is invalid";
        }
        if (isNaN(mAge)) {
            errorMessages.mAge = "Age is invalid";
        }
        if (Object.keys(errorMessages).length !== 0) {
            this.setState({ errorMessages });
        } else {
            const { createFamily } = this.props;
            let mImgUrl, fImgUrl, backgroundAvatar = "";
            if (avatarType === "camera" && mAvatar) {

                const uploadTask = storage.ref(`images/${mAvatar.name}`).put(mAvatar);
                uploadTask.on('state_changed', 
                (snapshot) => {

                },
                (error)=> {
                    console.log(error);
                },
                () => {
                    storage.ref('images').child(mAvatar.name).getDownloadURL().then(url => {
                        mImgUrl = url;
                    });
                })

            } else {
                mImgUrl = indexConstants.MEMBER_IMG_DEFAULT;
                backgroundAvatar = avatarType;
            }

            if (fImage) {

                const uploadTask = storage.ref(`images/${fImage.name}`).put(fImage);
                uploadTask.on('state_changed',
                (snapshot) => {

                },
                (error)=> {
                    console.log(error);
                },
                () => {
                    storage.ref('images').child(fImage.name).getDownloadURL().then(url => {
                        fImgUrl = url;
                    })
                })

            } else {
                fImgUrl = indexConstants.FAMILY_IMG_DEFAULT;
            }

            const inforCreate = { fName, fPassword, "fImage": fImgUrl, mName, "mAvatar": mImgUrl, mEmail, mAge, mRole, "mBackgroundColorAvatar": backgroundAvatar }
            createFamily(inforCreate);
        }

    }    

    render() {

        const { mName, mEmail, mAge, mRole, avatarType, currentUrlImg, errorMessages } = this.state;
        
        let Avatar;
        if (avatarType === "camera") {
            Avatar = () => <img src={currentUrlImg} className="upload-container" />
        } else {
            Avatar = () => <img src={profileImg} className={`upload-container ${avatarType}-avatar`} />
        }

        return (
            
            <Row justify="center" align="middle" className="create-profile-container">
                <Col md={6}>
                    <Form size="large" initialValues={{ remember: true }} >
                        <Form.Item style={{textAlign: "center"}}>
                            <Avatar />
                        </Form.Item>
                        <Form.Item>
                            <Radio.Group defaultValue={avatarType} onChange={this.handleChangeTypesOfImage} className="list-avatar-container">
                                <Radio.Button value="camera" className="avatar camera-avatar"> 
                                    <input onChange={this.handleChangeImg} className="input-member-img" type="file"/> 
                                    <i className="fa fa-camera camera-icon" aria-hidden="true" /> 
                                </Radio.Button>
                                <Radio.Button value="pink" className="avatar pink-avatar"></Radio.Button>
                                <Radio.Button value="yellow" className="avatar yellow-avatar"></Radio.Button>
                                <Radio.Button value="orange" className="avatar orange-avatar"></Radio.Button>
                                <Radio.Button value="purple" className="avatar purple-avatar"></Radio.Button>
                                <Radio.Button value="blue" className="avatar blue-avatar"></Radio.Button>
                                <Radio.Button value="green" className="avatar green-avatar"></Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item >
                            <Input 
                                name="mName" value={mName} onChange={this.handleChange}
                                prefix={<i className="fa fa-user" aria-hidden="true"></i>} 
                                placeholder="Name" 
                            />
                            { errorMessages.mName && <div className="text-red"> {errorMessages.mName} </div> }
                        </Form.Item>
                        <Form.Item >
                            <Input
                                name="mEmail" value={mEmail} onChange={this.handleChange}
                                prefix={<i className="fa fa-envelope" aria-hidden="true"></i>}
                                type="text"
                                placeholder="Email"
                            />
                            { errorMessages.mEmail && <div className="text-red"> {errorMessages.mEmail} </div> }
                        </Form.Item>
                        <Form.Item >
                            <Input 
                                name="mAge" value={mAge} onChange={this.handleChange}
                                prefix={ <i className="fa fa-birthday-cake" aria-hidden="true"></i> } 
                                placeholder="Age" 
                            />
                            { errorMessages.mAge && <div className="text-red"> {errorMessages.mAge} </div> }
                        </Form.Item>
                        <Form.Item>
                            <Row style={{ width: '100%' }}>
                                <Col span={16}>
                                    <Select defaultValue={mRole} onChange={this.handleChangeRole}>
                                        <Select.Option value="Father">Father</Select.Option>
                                        <Select.Option value="Mother">Mother</Select.Option>
                                    </Select>
                                </Col>
                                <Col span={8}> 
                                    <Radio className="radio-admin" defaultChecked disabled={true}> Admin </Radio> 
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row>
                                <Col span={11}>
									<Button onClick={this.handleClickBack} className="button-back" >
										Back
                                	</Button>
								</Col>

								<Col span={11} offset={2}>
									<Button onClick={this.handleClickCreate} className="button-next" type="primary">
										Create
                                    </Button>
								</Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
                   
        );
    }
}

const actionCreators = {
    createFamily: familyActions.createFamily
}

export default connect(null, actionCreators)(RegisterAccount);