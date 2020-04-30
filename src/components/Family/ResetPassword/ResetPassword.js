import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Spin } from "antd";
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
            this.setState({ stateConfirm: "error", errorConfirm: "Mật khẩu xác nhận không đúng!"});
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
                <div className="title-reset-password"> Đặt lại mật khẩu </div>
                <Form onFinish={this.handleSubmit} size="large">
                    <Form.Item name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]} >
                        <Input
                            type="password" placeholder="Mật khẩu mới"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                    </Form.Item>

                    <Form.Item 
                        name="confirmPassword" validateStatus={stateConfirm} help={errorConfirm} 
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' }]} 
                    >
                        <Input
                            type="password" placeholder="Mật khẩu xác nhận"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit" className="login-form-button"> Gửi </Button>
                        {this.props.resetting && !this.props.resetted &&
                            <Spin tip="Đang xử lý..." />
                        }
                    </Form.Item>
                </Form>
            </div>
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