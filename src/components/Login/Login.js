import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'react-redux';
import { memberActions } from '../../actions/member.actions';
import './Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            remember: true
        }
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleChangeRemember = (e) => {
        this.setState({ remember: e.target.checked });
    }

    handleSubmit = () => {
        const { email, password, remember } = this.state;
        const { login } = this.props;
        login(email, password, remember);
    }

    render() {

        const { email, password } = this.state;
        const { loggingIn } = this.props;

        return (
            <div className="container-login">
                <div className="title-login">
                    Your Account
                </div>  
                <Form onFinish={this.handleSubmit} className="login-form" initialValues={{remember: true}}>

                    <Form.Item name="email" rules={[ { required: true, message: 'Please input your email!' } ]} >
                        <Input 
                            name="email" value={email} onChange={this.handleChangeInput} 
                            prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" size="large" type="text"
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[ { required: true, message: 'Please input your Password!'} ]} >
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
                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item style={{textAlign: "center"}}>
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
    login: memberActions.login
}

export default connect(mapStateToProps, actionCreators)(Login);