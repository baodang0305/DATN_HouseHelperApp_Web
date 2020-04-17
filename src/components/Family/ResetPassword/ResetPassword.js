import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

import "./ResetPassword.css";
import { memberActions } from "../../../actions/member.actions";

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateConfirm: "",
            errorConfirm: null
        }
    }

    handleSubmit = (fieldsValue) => {
        if (fieldsValue.newPassword !== fieldsValue.confirmPassword) {
            this.setState({ stateConfirm: "error", errorConfirm: "Confirm password invalid!"});
        } else {
            const { resetPassword } = this.props;
            const rpID = this.props.match.params.id;
            this.setState({ stateConfirm: "", errorConfirm: null});
            resetPassword({ "newPassword": fieldsValue.newPassword, rpID });
        }
    }

    render() {

        const { stateConfirm, errorConfirm } = this.state;

        return (

            <div className="container-reset-password">

                <div className="title-reset-password"> Reset Your Password </div>

                <Form onFinish={this.handleSubmit} >

                    <Form.Item name="newPassword" rules={[{ required: true, message: 'Please input your new Password!' }]} >
                        <Input
                            type="password" placeholder="New Password"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                    </Form.Item>

                    <Form.Item 
                        name="confirmPassword" validateStatus={stateConfirm} help={errorConfirm} 
                        rules={[{ required: true, message: 'Please input your confirm Password!' }]} 
                    >
                        <Input
                            type="password" placeholder="Confirm Password"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button"> Reset </Button>
                    </Form.Item>
                    
                </Form>

            </div>

        );
        
    }
}

const actionCreators = {
    resetPassword: memberActions.resetPassword
}

export default connect(null, actionCreators)(ResetPassword);