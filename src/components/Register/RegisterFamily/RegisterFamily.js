import React, { Component } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import history from "../../../helpers/history";
import { indexConstants } from "../../../constants/index.constants";
import "./RegisterFamily.css";

class RegisterFamily extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fName: "",
			fPassword: "",
			currentUrlImg: indexConstants.FAMILY_IMG_DEFAULT,
			fImage: null,
			fConfirmPassword: "",
			messageError: {
				fName: "",
				fPassword: "",
				fConfirmPassword: ""
			}
		}
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}

	handleChangeImg = (e) => {
		this.setState({
			currentUrlImg: URL.createObjectURL(e.target.files[0]),
			fImage: e.target.files[0]
		});
	}

	handleClickBack = () => {
		history.goBack();
	}

	handleClickNext = (e) => {
		const { fName, fPassword, fConfirmPassword, fImage } = this.state;
		let messageError = {};
		if (fName === "") {
			messageError.fName = "name family is required";
		}
		if (fPassword === "") {
			messageError.fPassword = "password is required";
		}
		if (fConfirmPassword === "") {
			messageError.fConfirmPassword = "confirm password is required";
		}
		if (fPassword === fConfirmPassword && Object.keys(messageError).length === 0) {
			history.push("/create-account", {fName, fPassword, fImage});
		} else {
			if (fPassword !== fConfirmPassword) {
				messageError.fConfirmPassword = "confirm password is invalid";
			}
			this.setState({ messageError });
		}
	}

	render() {

		const { fName, fPassword, fConfirmPassword, messageError, currentUrlImg } = this.state;

		return (
			<div className="body-container">
				<div className="container-create-family">
					<div className="title-form-create-family">Create Family</div>
					<Form 
						className="form-create-family"
						size="large"
						initialValues={{ remember: true }}
					>
						
						<Form.Item style={{textAlign: "center"}}>
							<img src={currentUrlImg} className="family-img"/>
							<input onChange={this.handleChangeImg} type="file" className="input-upload-family-img"/>
						</Form.Item>
						<Form.Item >
							<Input 
								name="fName" value={fName} 
								prefix={<UserOutlined className="site-form-item-icon" />} 
								placeholder="Name your family" 
								onChange={this.handleChange}
							/>
							{ messageError.fName && <div className="text-red"> {messageError.fName} </div> }
						</Form.Item>
						<Form.Item >
							<Input
								name="fPassword" value={fPassword}
								onChange={this.handleChange}
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Set family password"
							/>
							{ messageError.fPassword && <div className="text-red"> {messageError.fPassword} </div> }
						</Form.Item>
						<Form.Item >
							<Input
								name="fConfirmPassword" value={fConfirmPassword}
								onChange={this.handleChange}
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Confirm family password"
							/>
							 { messageError.fConfirmPassword && <div className="text-red"> {messageError.fConfirmPassword} </div> }
						</Form.Item>

						<Form.Item>
							<Row>
								<Col span={11}>
									<Button onClick={this.handleClickBack} className="button-back" >
										Back
                                	</Button>
								</Col>

								<Col span={11} offset={2}>
									<Button onClick={this.handleClickNext} className="button-next" type="primary">
										Next
                                    </Button>
								</Col>
							</Row>
						</Form.Item>
					</Form>
				</div>
			</div>
		);
	}
}

export default RegisterFamily;