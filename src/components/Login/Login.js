import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Modal, Spin } from 'antd';

import './Login.css';
import { memberActions } from '../../actions/member.actions';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            visibleModal: false,
            emailResetPass: "",
            isSubmitForgotForm: false,
        }
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = () => {
        const { email, password } = this.state;
        const { login } = this.props;
        login(email, password);
    }

    handleSend = (e) => {
        const { requestResetPassword } = this.props;
        const { emailResetPass } = this.state;
        if (emailResetPass) {
            this.setState({ visibleModal: false });
            requestResetPassword({ "email": emailResetPass, "type": "member" });
        } else {
            this.setState({ isSubmitForgotForm: true });
        }

    };

    render() {
        const { email, password, emailResetPass, visibleModal, isSubmitForgotForm } = this.state;
        return (
            <div className="container-login">
                <div className="title-login">  Đăng Nhập </div>
                <Form onFinish={this.handleSubmit} >
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
                        <div onClick={() => this.setState({ visibleModal: true })} className="text-forgot"> Quên mật khẩu? </div>
                        <Modal title={null} footer={null} closable={false} visible={visibleModal} width={400}>
                            <div className="title-forgot-form" >
                                <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                                &nbsp;
                                Please input email to reset password!
                            </div>
                            <Form onFinish={this.handleSend}>
                                <div className="email-input-container">
                                    <Input
                                        name="emailResetPass" value={emailResetPass} onChange={this.handleChangeInput}
                                        prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" type="email"
                                    />
                                    {isSubmitForgotForm && emailResetPass === "" && <div className="error-text-forgot-form">Vui lòng nhập email</div>}
                                </div>
                                <div className="button-forgot-form-container">
                                    <Button onClick={() => this.setState({ visibleModal: false })} className="button-item-forgot-form"> Đóng </Button>
                                    <Button htmlType="submit" type="primary" className="button-item-forgot-form"> Gửi </Button>
                                </div>
                            </Form>
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