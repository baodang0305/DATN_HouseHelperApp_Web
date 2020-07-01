import React, { Component } from 'react';
import './DataGroceryType.css';
import { LeftOutlined, CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import {
    Form, Input, Button, Row, Col, Select, Avatar, Layout, Tooltip, Alert, Spin
} from 'antd';
import { connect } from 'react-redux';
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { groceryTypeActions } from '../../../actions/grocery.type.actions';
import history from '../../../helpers/history';
import Axios from 'axios';
import apiUrlTypes from '../../../helpers/apiURL'

const { Option } = Select;
const { Header, Content } = Layout;

class DataFormGroceryType extends Component {
    state = {
        tcIDGroceryType: null,
        nameGroceryType: null,
        imageGroceryType: null,
        onChangedData: null,
        idChosenImage: null,
        listIconType: null,
        loading: true
    };

    componentDidMount() {
        const { chosenTypeToEdit } = history.location.state || { chosenTypeToEdit: null };
        const { type } = this.props;
        type === 'edit'
            ? this.setState({
                tcIDGroceryType: chosenTypeToEdit._id,
                nameGroceryType: chosenTypeToEdit.name,
                imageGroceryType: chosenTypeToEdit.image,
            }) : null;

        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;

        Axios.get(`${apiUrlTypes.heroku}/list-task-category-icon`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                this.setState({ listIconType: res.data.list, loading: false });

            })
            .catch(err => {
                console.log(err)
            })
    }

    handleInputChange = (event) => {
        this.setState({ nameGroceryType: event.target.value, onChangedData: true });
    }

    handleClickBack = () => {
        history.goBack();
    }

    handleChangeImageGroceryType = (itemSrcImage) => {
        this.setState({
            idChosenImage: itemSrcImage,
            imageGroceryType: itemSrcImage
        });
    }

    handleSubmit = () => {
        const { addGroceryType, editGroceryType, type } = this.props;
        const { tcIDGroceryType, nameGroceryType, imageGroceryType } = this.state;
        type === "add" ? addGroceryType(nameGroceryType, imageGroceryType) : editGroceryType(tcIDGroceryType, nameGroceryType, imageGroceryType);
    }

    validateDataForForm = () => {
        const { allGroceryTypes, type } = this.props;
        const { nameGroceryType } = this.state;
        if (type === 'edit') {
            if (!nameGroceryType)
                return false;
        }
        else if (!nameGroceryType || allGroceryTypes.findIndex(item => item.name === nameGroceryType) !== -1)
            return false
        return true;
    }
    render() {
        const { type } = this.props;
        const { chosenTypeToEdit } = history.location.state || { chosenTypeToEdit: null };
        const { nameGroceryType, imageGroceryType, idChosenImage, listIconType, loading } = this.state;
        console.log(nameGroceryType, imageGroceryType, idChosenImage);
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="6" />
                <Layout className="site-layout">
                    <Header className="header-container" style={{ padding: '0 10px' }}>
                        <div className="add-task__header">
                            <div
                                className="header__btn-link"
                                onClick={this.handleClickBack}
                                size="large">
                                <LeftOutlined onClick={() => { this.handleClickBack }} />
                            </div>
                            <div className="add-task__header-title">{type === 'add' ? 'Tạo loại danh sách mua sắm' : 'Sửa loại danh sách mua sắm'}</div>
                        </div>
                    </Header>
                    <Content className="task-cate-form__content" style={{ height: '100vh', backgroundColor: loading ? 'white' : null }}>
                        {!loading ? <div className="container-data-form-grocery-type" style={{ minHeight: '100vh' }}>
                            <Form onFinish={this.handleSubmit}
                                layout="vertical"
                                name="basic">
                                <Form.Item className="form-item-add-grocery-type">
                                    <Input className="input-item-add-grocery-type"
                                        defaultValue={type === "edit" ? chosenTypeToEdit.name : null}
                                        name="nameGroceryType"
                                        onChange={this.handleInputChange} size="large" placeholder="Tên loại danh sách mua sắm"
                                    />
                                </Form.Item>
                                <Form.Item className="form-item-add-grocery-type">
                                    <div className="recent-image-grocery-type">
                                        <Avatar className="recent-avatar-grocery-type" src={idChosenImage ? idChosenImage : (chosenTypeToEdit ? chosenTypeToEdit.image : null)} />
                                    </div>
                                    <div className="title-choose-image-grocery-type">Chọn một hình ảnh đại diện:</div>
                                    <div className="list-all-image-grocery-type">
                                        <Row gutter={[20, 10]} >
                                            {listIconType ? listIconType.map(item =>
                                                <Col key={item} className="container-item-image-grocery-type" lg={4} xl={4} md={4} sm={4} xs={5} key={item}>
                                                    <div className="item-image-grocery-type">
                                                        <Avatar className={item === idChosenImage ? "checked-avatar-item-image-grocery-type" : "avatar-item-image-grocery-type"}
                                                            src={item} onClick={(e) => this.handleChangeImageGroceryType(item)} />
                                                        {item === idChosenImage ? <CheckOutlined className="checked-assignment-add-cate" /> : null}
                                                    </div>
                                                </Col>) : null}
                                        </Row>
                                    </div>
                                    <div className="btn-container-grocery-type">
                                        <Button className="btn-grocery-type" type="default">Hủy</Button>
                                        <Button htmlType="submit" disabled={!this.validateDataForForm()} className="btn-grocery-type" type="primary">{type === "add" ? "Thêm" : "Lưu"}</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div> : <div className="spin-get-list-members loading-data spin-load"><Spin tip="Đang tải..." /> </div>}
                    </Content>
                </Layout>
            </Layout >
        )
    }
}

const mapStateToProps = (state) => ({
    allGroceryTypes: state.groceryType.allGroceryTypes,
})

const actionCreators = {
    getAllGroceryTypes: groceryTypeActions.getAllGroceryTypes,
    addGroceryType: groceryTypeActions.addGroceryType,
    editGroceryType: groceryTypeActions.editGroceryType
}
export default connect(mapStateToProps, actionCreators)(DataFormGroceryType);
