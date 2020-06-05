import './DataFormGrocery.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LeftOutlined, ShoppingCartOutlined, CheckCircleOutlined, EditOutlined, TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    Form, Input, Button, Row, Col, Select, Avatar, Layout, Tooltip, Alert, Spin, Divider, List
} from 'antd';

import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from "../../../actions/family.actions";
import { groceryActions } from "../../../actions/grocery.actions";
const { Option } = Select;
const { Header, Content } = Layout;
const dataList = [{ stt: 1, name: 'Củ cải', note: 'Đi siêu thị mua chọn đồ tươi' },
{ stt: 2, name: 'Xu hào', note: 'Đi siêu thị mua chọn đồ tươi' },
{ stt: 3, name: 'Mì xáo bó', note: 'Đi siêu thị mua chọn đồ tươi' }]

class DataFormGrocery extends Component {
    handleSubmit = () => {

    }

    componentWillMount() {
        const { getListMembers } = this.props;
        getListMembers();
    }


    render() {
        const { type, listMembers } = this.props;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="5" />
                <Layout className="site-layout">
                    <Header className="header-container" style={{ padding: 0 }}>
                        <div className="grocery-form__header">
                            <div
                                className="grocery-form__header-btn-link"
                                onClick={this.handleClickBack}
                                size="large">
                                <LeftOutlined onClick={() => { this.handleClickBack }} />
                            </div>
                            <div className="grocery-form__header-title">{type === 'add' ? 'Tạo danh sách' : 'Sửa danh sách'}</div>
                        </div>
                    </Header>
                    <Content className="grocery-form__content">
                        <Form onFinish={this.handleSubmit}
                            layout="vertical" name="grocery-form" className="grocery-form__form-container">
                            <Form.Item className="grocery-form__form-item">
                                <Input className="grocery-form__input-name"
                                    defaultValue={type === "edit" ? chosenCateToEdit.name : null}
                                    name="nameGrocery"
                                    onChange={this.handleInputChange} size="large" placeholder="Tên danh sách"
                                />
                            </Form.Item>
                            <Form.Item className="grocery-form__form-item" style={{ paddingTop: 5 }}
                                label={
                                    <div className="grocery-form__item-label">
                                        <TeamOutlined style={{ marginRight: 8 }} />
                                        <div>Thành viên</div>
                                    </div>
                                }>
                                <div className="grocery-form__members-container">
                                    {listMembers ? listMembers.map(item =>
                                        <div className="grocery-form__member-item">
                                            <Avatar src={item.mAvatar.image} className="grocery-form__avatar"></Avatar>
                                            <div className="grocery-form__title-avatar">{item.mName}</div>
                                        </div>
                                    )
                                        : null}
                                </div>
                            </Form.Item>
                            <Form.Item className="grocery-form__form-item" style={{ paddingTop: 5 }}
                                label={
                                    <div className="grocery-form__item-label">
                                        <ShoppingCartOutlined style={{ marginRight: 8 }} />
                                        <div>Danh sách vật phẩm</div>
                                    </div>
                                }>
                                <div className="grocery-form__list-container">
                                    {dataList.map(item =>
                                        <div className="grocery-form__item">
                                            <div className="grocery-form__stt-item">{item.stt}.</div>
                                            <div className="grocery-form__main-info-item">
                                                <div className="grocery-form__des-item">
                                                    <div className="grocery-form__name-item">    {item.name}</div>
                                                    <div className="grocery-form__note-item">{item.note}</div>
                                                </div>
                                                <div className="grocery-from__action-item">
                                                    <div className="grocery__action" style={{ color: '#13c2c2' }}>
                                                        <EditOutlined className="grocery__icon-action" />
                                                        <div className="grocery__title-action" >Sửa</div>
                                                    </div>
                                                    <div className="grocery__action" style={{ color: '#EC6764' }}>
                                                        <DeleteOutlined className="grocery__icon-action" />
                                                        <div className="grocery__title-action">Xóa</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>)}
                                </div>
                                <Divider>Thêm vật phẩm</Divider>
                                <div className="grocery-form__add-item-container">
                                    <Row gutter={[30, 0]} style={{ width: '100%' }}>
                                        <Col lg={12} xl={12}>
                                            <Form.Item label="Tên vật phẩm">
                                                <Input placeholder="Nhập tên vật phẩm..."></Input>
                                            </Form.Item>
                                            <Form.Item label="Ghi chú vật phẩm">
                                                <Input placeholder="Ghi chú vật phẩm: Số lượng, khối lượng,..."></Input>
                                            </Form.Item>
                                        </Col>
                                        <Col lg={12} xl={12}>
                                            <Form.Item label="Hình ảnh vật phẩm:">
                                                <div className="grocery-form__input-image">

                                                </div>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                                <Form.Item>
                                    <div className="grocery-form__btn">
                                        <Button type="default" style={{ marginRight: '10px' }}>Hủy</Button>
                                        <Button type="primary">Thêm danh sách</Button>
                                    </div>
                                </Form.Item>

                            </Form.Item>

                        </Form>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.inforLogin.user,
    token: state.authentication.inforLogin.token,
    listMembers: state.family.listMembers,
    loadingMember: state.family.loading,
    allGroceries: state.grocery.allGroceries,
    loadingGrocery: state.grocery.loadingGrocery,
})

const actionCreators = {
    getListMembers: familyActions.getListMembers,
    getAllGroceries: groceryActions.getAllGroceries,
}

export default connect(mapStateToProps, actionCreators)(DataFormGrocery);