import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Modal, Spin } from 'antd';

import './Login.css';
import { memberActions } from '../../actions/member.actions';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            visible: false,
            remember: true,
            emailResetPass: "",
            errorEmailResetPass: null,
            stateEmailResetPass: "error"
        }
    }

    handleChangeInput = (e) => {

        const { name, value } = e.target;

        this.setState({ [name]: value });

        if (name === "emailResetPass") {

            if (value === "") {

                this.setState({ stateEmailResetPass: "error",  errorEmailResetPass: "Vui lòng nhập email" });

            } else {

                this.setState({ stateEmailResetPass: "", errorEmailResetPass: null });
            }

        }

    }

    handleChangeRemember = (e) => {

        this.setState({ remember: e.target.checked });

    }

    handleSubmit = () => {

        const { email, password, remember } = this.state;
        const { login } = this.props;
        login(email, password, remember);

    }

    showBoxInputEmail = () => {

        this.setState({ visible: true });

    };

    handleSend = (e) => {

        const { requestResetPassword } = this.props;
        const { stateEmailResetPass, emailResetPass } = this.state;

        if (stateEmailResetPass === "") {

            this.setState({ visible: false });
            requestResetPassword({ "email": emailResetPass, "type": "member" });

        }

    };

    handleCancel = (e) => {

        this.setState({ visible: false });

    };

    render() {

        const { email, password, emailResetPass, visible, stateEmailResetPass, errorEmailResetPass } = this.state;

        return (

            <div className="container-login">

                <div className="title-login">  Đăng Nhập </div>

                <Form onFinish={this.handleSubmit} initialValues={{ remember: true }}>

                    <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]} >
                        <Input
                            name="email" value={email} onChange={this.handleChangeInput}
                            prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" size="large" type="text"
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} >
                        <Input
                            name="password" value={password} onChange={this.handleChangeInput}
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password" placeholder="Mật khẩu" size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox onChange={this.handleChangeRemember}>Ghi nhớ!</Checkbox>
                        </Form.Item>
                        <div onClick={this.showBoxInputEmail} className="login-form-forgot title-forgot"> Quên mật khẩu? </div>
                        <Modal
                            onOk={this.handleSend}
                            onCancel={this.handleCancel}
                            closable={false} visible={visible}
                            title="Please input email to reset password!"
                            footer={[
                                <Button key="back" onClick={this.handleCancel}> Đóng </Button>,
                                <Button key="submit" type="primary" onClick={this.handleSend}> Gửi </Button>
                            ]}
                        >
                            <Form.Item validateStatus={stateEmailResetPass} help={errorEmailResetPass}>
                                <Input
                                    name="emailResetPass" value={emailResetPass} onChange={this.handleChangeInput}
                                    prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" type="email"
                                />
                            </Form.Item>
                        </Modal>

                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="large" ghost> Đăng nhập </Button>
                        {this.props.loggingIn && !this.props.loggedIn &&
                            <Spin tip="Loading..." />
                        }
                    </Form.Item>

                    <FormItem className="register-link">
                        <Link to="/create-family">Tạo gia đình!</Link>
                    </FormItem>

                </Form>

            </div>

        );

    }
};

const mapStateToProps = (state) => {
    const { loggingIn, loggedIn } = state.authentication;
    return { 
        loggedIn,
        loggingIn 
    };
}

const actionCreators = {
    login: memberActions.login,
    requestResetPassword: memberActions.requestResetPassword
}

export default connect(mapStateToProps, actionCreators)(Login);