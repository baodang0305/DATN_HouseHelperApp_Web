import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Spin } from "antd";

import "./ActiveAccount.css";
import { familyActions } from "../../../actions/family.actions";

const ActiveAccount = (props) => {

    const handleSubmit = (fieldsValue) => {
        const { activeAccount } = props;
        const aaID = props.match.params.id;
        activeAccount({ "code": fieldsValue.code, aaID });
    }


    return (

        <div className="container-active-account">

            <div className="title-active-account"> Kích Hoạt Tài Khoản </div>

            <Form onFinish={handleSubmit} size="large" >

                <Form.Item name="code" rules={[{ required: true, message: 'Vui lòng nhập mã code!' }]} >
                    <Input type="text" placeholder="Code" />
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" className="login-form-button"> Xác Nhận </Button>
                    {props.activating && !props.activated &&
                        <Spin tip="Loading..." />
                    }
                </Form.Item>

            </Form>

        </div>

    );

}

const mapStateToProps = (state) => {
    return {
        activated: state.family.activated,
        activating: state.family.activating
    }
}

const actionCreators = {
    activeAccount: familyActions.activeAccount
}

export default connect(mapStateToProps, actionCreators)(ActiveAccount);