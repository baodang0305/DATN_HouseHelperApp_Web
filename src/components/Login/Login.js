import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import { Form, Input, Button, Checkbox, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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

                this.setState({ stateEmailResetPass: "error",  errorEmailResetPass: "Please input your email" });

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

        const { loggingIn } = this.props;
        const { email, password, emailResetPass, visible, stateEmailResetPass, errorEmailResetPass } = this.state;

        return (

            <div className="container-login">

                <div className="title-login">  Your Account </div>

                <Form onFinish={this.handleSubmit} initialValues={{ remember: true }}>

                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]} >
                        <Input
                            name="email" value={email} onChange={this.handleChangeInput}
                            prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" size="large" type="text"
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]} >
                        <Input
                            name="password" value={password} onChange={this.handleChangeInput}
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password" placeholder="Password" size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox onChange={this.handleChangeRemember}>Remember me</Checkbox>
                        </Form.Item>
                        <div onClick={this.showBoxInputEmail} className="login-form-forgot title-forgot"> Forgot password </div>
                        <Modal
                            onOk={this.handleSend}
                            onCancel={this.handleCancel}
                            closable={false} visible={visible}
                            title="Please input email to reset password!"
                            footer={[
                                <Button key="back" onClick={this.handleCancel}> Cancel </Button>,
                                <Button key="submit" type="primary" onClick={this.handleSend}> Submit </Button>
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
                        <Button type="primary" htmlType="submit" className="login-form-button" size="large" ghost> Log in </Button>
                        {loggingIn &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </Form.Item>

                    <FormItem className="register-link">
                        <Link to="/create-family">Create family now!</Link>
                    </FormItem>

                </Form>

            </div>

        );

    }
};

const mapStateToProps = (state) => {

    const { loggingIn } = state.authentication;
    return { loggingIn };

}

const actionCreators = {

    login: memberActions.login,
    requestResetPassword: memberActions.requestResetPassword
    
}

export default connect(mapStateToProps, actionCreators)(Login);