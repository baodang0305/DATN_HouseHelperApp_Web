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
			statusConfirmPass: "",
			confirmPassValidate: null,
			currentUrlImg: indexConstants.FAMILY_IMG_DEFAULT
		}
	}

	handleChangeInput = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	handleChangeImg = (e) => {
		this.setState({ currentUrlImg: URL.createObjectURL(e.target.files[0]), fImage: e.target.files[0] });
	}

	handleClickBack = () => {
		history.push("/login");
	}

	handleSubmit = () => {

		const { fPassword, fConfirmPassword, fImage, fName } = this.state;
		if (fPassword === fConfirmPassword) {
			if (!fImage) {
				const fImgUrl = indexConstants.FAMILY_IMG_DEFAULT;
				history.push("/create-account", {fName, fPassword, fImgUrl});
			} else {
				const uploadTask = storage.ref(`images/${fImage.name}`).put(fImage);
				uploadTask.on('state_changed',
				(snapshot) => {

				},
				(error)=> {
					console.log(error);
				},
				async () => {
					const fImgUrl = await storage.ref('images').child(fImage.name).getDownloadURL();
					history.push("/create-account", {fName, fPassword, fImgUrl});
				});
			}
		} else {
			this.setState({ statusConfirmPass: "error", confirmPassValidate: "Mật khẩu xác nhận không đúng!" });
		}
	}

	render() {

		const { fName, fPassword, fConfirmPassword, currentUrlImg, statusConfirmPass, confirmPassValidate } = this.state;

		return (

			<div className="body-container">

				<div className="container-create-family">

					<div className="title-form-create-family">Đăng Kí Gia Đình</div>

					<Form onFinish={this.handleSubmit} size="large" className="form-create-family" >
						
						<Form.Item style={{textAlign: "center"}}>
							<div className="container-family-img">
								<img src={currentUrlImg} className="family-img" />
								<input onChange={this.handleChangeImg} type="file" className="input-family-img"/> 
							</div>
						</Form.Item>

						<Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]} >
							<Input 
								name="fName" value={fName} onChange={this.handleChangeInput}
								placeholder="Tên gia đình"  prefix={<UserOutlined className="site-form-item-icon" />} 
							/>
						</Form.Item>

						<Form.Item name="password" rules={[ { required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
							<Input
								type="password" placeholder="Mật khẩu"
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="fPassword" value={fPassword} onChange={this.handleChangeInput}
							/>
						</Form.Item>

						<Form.Item 
							validateStatus={statusConfirmPass}
							help={confirmPassValidate}
							name="confirm" rules={[{ required: true , message: "Vui lòng nhập mật khẩu xác nhận!" }]} 
						>
							<Input
								type="password" placeholder="Mật khẩu xác nhận"
								prefix={<LockOutlined className="site-form-item-icon" />}
								name="fConfirmPassword" value={fConfirmPassword} onChange={this.handleChangeInput}
							/>
						</Form.Item>

						<Form.Item >
							<Row>
								<Col span={11}> <Button onClick={this.handleClickBack} className="button-back" > Quay lại </Button> </Col>
								<Col span={11} offset={2}> <Button className="button-next" type="primary" htmlType="submit"> Tiếp theo </Button> </Col>
							</Row>
						</Form.Item> 

					</Form>

				</div>

			</div>

		);
		
	}
}

export default RegisterFamily;