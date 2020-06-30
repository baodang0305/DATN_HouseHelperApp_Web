import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";

import "./ResetPassword.css";
import { memberActions } from "../../../actions/member.actions";
import Password from "antd/lib/input/Password";

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubmit: false,
            newPassword: "",
            confirmPassword: "",
        }
    }

    handleSubmit = (e) => {
        const { newPassword, confirmPassword } = this.state;
        if (newPassword && newPassword === confirmPassword) {
            const { resetPassword } = this.props;
            const rpID = this.props.match.params.id;
            resetPassword({ "newPassword": fieldsValue.newPassword, rpID });
        } else {
            this.setState({ isSubmit: true })
        }
    }

    render() {

        const { newPassword, confirmPassword, isSubmit } = this.state;

        return (

            <div className="container-reset-password">
                <div className="title-reset-password"> Đặt lại mật khẩu </div>
                <Form onFinish={this.handleSubmit} size="large">
                    <div className="form-item-reset-password">
                        <Input
                            name="password" value={newPassword}
                            onChange={(e) => this.setState({ newPassword: e.target.value })}
                            type="password" placeholder="Mật khẩu mới"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                        {isSubmit && !newPassword && < div className="error-message-reset-pass-form">Vui lòng nhập mật khẩu mới</div>}
                    </div>

                    <div className="form-item-reset-password">
                        <Input
                            name="confirmPassword" value={confirmPassword}
                            onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                            type="password" placeholder="Mật khẩu xác nhận"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                        {isSubmit && confirmPassword !== newPassword &&
                            <div className="error-message-reset-pass-form">Mật khẩu xác nhận chưa đúng </div>
                        }
                    </div>
                    <div className="form-item-reset-password spin-reset-pass-container">
                        <Button type="primary" htmlType="submit" className="login-form-button"> Gửi </Button>
                        {this.props.resetting && !this.props.resetted &&
                            <Spin tip="Đang xử lý..." />
                        }
                    </div>
                </Form>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        resetted: state.family.resetted,
        resetting: state.family.resetting
    }
}

const actionCreators = {
    resetPassword: memberActions.resetPassword
}

export default connect(mapStateToProps, actionCreators)(ResetPassword);