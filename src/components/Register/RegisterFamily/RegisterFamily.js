import React, { Component } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./RegisterFamily.css";
import history from "../../../helpers/history";
import { storage } from "../../../helpers/firebaseConfig";
import { indexConstants } from "../../../constants/index.constants";

class RegisterFamily extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fName: "",
			fPassword: "",
			fImage: null,
			fConfirmPassword: "",
			isSubmited: false,
			currentUrlImg: indexConstants.FAMILY_IMG_DEFAULT
		}
	}

	handleChangeInput = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	handleChangeImg = (e) => {
		this.setState({
			currentUrlImg: URL.createObjectURL(e.target.files[0]),
			fImage: e.target.files[0]
		});
	}

	handleClickBack = () => {
		history.push("/login");
	}

	handleSubmit = () => {
		const { fPassword, fConfirmPassword, fImage, fName } = this.state;
		if (fPassword !== "" && fPassword === fConfirmPassword) {
			if (!fImage) {
				const fImgUrl = indexConstants.FAMILY_IMG_DEFAULT;
				history.push("/create-account", { fName, fPassword, fImgUrl });
			} else {
				const uploadTask = storage.ref(`images/${fImage.name}`).put(fImage);
				uploadTask.on('state_changed',
					(snapshot) => {

					},
					(error) => {
						console.log(error);
					},
					async () => {
						const fImgUrl = await storage.ref('images').child(fImage.name).getDownloadURL();
						history.push("/create-account", { fName, fPassword, fImgUrl });
					});
			}
		} else {
			this.setState({ isSubmited: true });
		}
	}

	render() {
		const { fName, fPassword, fConfirmPassword, currentUrlImg, isSubmited } = this.state;
		return (
			<div className="body-register-family">
				<div className="container-create-family">
					<div className="title-create-family-form">Đăng Kí Gia Đình</div>
					<Form onFinish={this.handleSubmit} size="large" className="create-family-form" >
						<div className="form-item-register-family">
							<div className="container-family-img">
								<img src={currentUrlImg} className="family-img" />
								<input onChange={this.handleChangeImg} type="file" className="input-family-img" />
							</div>
						</div>
						<div className="form-item-register-family">
							<Input
								name="fName" value={fName} onChange={this.handleChangeInput}
								placeholder="Tên gia đình" prefix={<UserOutlined className="site-form-item-icon" />}
							/>
							{isSubmited && fName === "" && <div className="error-message-register-family-form">Vui lòng nhập tên</div>}
						</div>
						<div className="form-item-register-family">
							<Input
								type="password" placeholder="Mật khẩu"
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="fPassword" value={fPassword} onChange={this.handleChangeInput}
							/>
							{isSubmited && fPassword === "" && <div className="error-message-register-family-form">Vui lòng nhập mật khẩu</div>}
						</div>
						<div className="form-item-register-family">
							<Input
								type="password" placeholder="Mật khẩu xác nhận"
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="fConfirmPassword" value={fConfirmPassword} onChange={this.handleChangeInput}
							/>
							{isSubmited && (fConfirmPassword === "" || fConfirmPassword !== fPassword) &&
								<div className="error-message-register-family-form">Mật khẩu xác nhận chưa đúng</div>
							}
						</div>
						<div className="form-item-register-family button-register-family-container">
							<Button onClick={this.handleClickBack} className="button-item-register-family-form" > Quay lại </Button>
							<Button type="primary" htmlType="submit" className="button-item-register-family-form"> Tiếp theo </Button>
						</div>
					</Form>
				</div>
			</div>
		);
	}
}

export default RegisterFamily;