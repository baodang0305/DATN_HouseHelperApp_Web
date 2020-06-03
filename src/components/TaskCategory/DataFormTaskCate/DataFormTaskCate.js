import React, { Component } from 'react';
import './DataFormTaskCate.css';
import { LeftOutlined, CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import {
    Form, Input, Button, Row, Col, Select, Avatar, Layout, Tooltip, Alert, Spin
} from 'antd';
import { connect } from 'react-redux';
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { taskCateActions } from '../../../actions/task.cate.actions';
import history from '../../../helpers/history';
import Axios from 'axios';
import apiUrlTypes from '../../../helpers/apiURL'

const { Option } = Select;
const { Header, Content } = Layout;

class DataFormTaskCate extends Component {
    state = {
        tcIDTaskCate: null,
        nameTaskCate: null,
        imageTaskCate: null,
        onChangedData: null,
        idChosenImage: null,
        listIconCate: null,
        loading: true
    };

    componentDidMount() {
        const { chosenCateToEdit } = history.location.state || { chosenCateToEdit: null };
        const { type } = this.props;
        type === 'edit'
            ? this.setState({
                tcIDTaskCate: chosenCateToEdit._id,
                nameTaskCate: chosenCateToEdit.name,
                imageTaskCate: chosenCateToEdit.image,
            }) : null;

        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;


        Axios.get(`${apiUrlTypes.heroku}/list-task-category-icon`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                this.setState({ listIconCate: res.data.list, loading: false });

            })
            .catch(err => {
                console.log(err)
            })
    }

    handleInputChange = (event) => {
        this.setState({ nameTaskCate: event.target.value, onChangedData: true });
    }

    handleClickBack = () => {
        history.goBack();
    }

    handleChangeImageTaskCate = (itemSrcImage) => {
        this.setState({
            idChosenImage: itemSrcImage,
            imageTaskCate: itemSrcImage
        });
    }

    handleSubmit = () => {
        const { addTaskCate, editTaskCate, type } = this.props;
        const { tcIDTaskCate, nameTaskCate, imageTaskCate } = this.state;
        type === "add" ? addTaskCate(nameTaskCate, imageTaskCate) : editTaskCate(tcIDTaskCate, nameTaskCate, imageTaskCate);
    }

    validateDataForForm = () => {
        const { allTaskCates } = this.props;
        const { nameTaskCate } = this.state;
        if (!nameTaskCate || allTaskCates.findIndex(item => item.name === nameTaskCate) !== -1)
            return false
        return true;
    }
    render() {
        const { type } = this.props;
        const { chosenCateToEdit } = history.location.state || { chosenCateToEdit: null };
        const { nameTaskCate, imageTaskCate, idChosenImage, listIconCate, loading } = this.state;
        console.log(nameTaskCate, imageTaskCate, idChosenImage);
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="6" />
                <Layout className="site-layout">
                    <Header className="header-container" style={{ padding: 0 }}>
                        <div className="add-task__header">
                            <div
                                className="header__btn-link"
                                onClick={this.handleClickBack}
                                size="large">
                                <LeftOutlined onClick={() => { this.handleClickBack }} />
                            </div>
                            <div className="add-task__header-title">{type === 'add' ? 'Tạo loại công việc' : 'Sửa loại công việc'}</div>
                        </div>
                    </Header>
                    <Content className="task-cate-form__content" style={{ height: '100vh', backgroundColor: loading ? 'white' : null }}>
                        {!loading ? <div className="container-data-form-task-cate" style={{ minHeight: '100vh' }}>
                            <Form onFinish={this.handleSubmit}
                                layout="vertical"
                                name="basic">
                                <Form.Item className="form-item-add-task-cate">
                                    <Input className="input-item-add-task-cate"
                                        defaultValue={type === "edit" ? chosenCateToEdit.name : null}
                                        name="nameTaskCate"
                                        onChange={this.handleInputChange} size="large" placeholder="Tên loại công việc"
                                    />
                                </Form.Item>
                                <Form.Item className="form-item-add-task-cate">
                                    <div className="recent-image-task-cate">
                                        <Avatar className="recent-avatar-task-cate" src={type === "edit" ? chosenCateToEdit.image : idChosenImage} />
                                    </div>
                                    <div className="title-choose-image-task-cate">Chọn một hình ảnh đại diện:</div>
                                    <div className="list-all-image-task-cate">
                                        <Row gutter={[20, 10]} justify="center">
                                            {listIconCate ? listIconCate.map(item =>
                                                <Col key={item} className="container-item-image-task-cate" lg={4} xl={4} md={4} sm={4} xs={5} key={item}>
                                                    <div className="item-image-task-cate">
                                                        <Avatar className={item === idChosenImage ? "checked-avatar-item-image-task-cate" : "avatar-item-image-task-cate"}
                                                            src={item} onClick={(e) => this.handleChangeImageTaskCate(item)} />
                                                        {item === idChosenImage ? <CheckOutlined className="checked-assignment-add-cate" /> : null}
                                                    </div>
                                                </Col>) : null}
                                        </Row>
                                    </div>
                                    <div className="btn-container-task-cate">
                                        <Button className="btn-task-cate" type="default">Hủy</Button>
                                        <Button htmlType="submit" disabled={!this.validateDataForForm()} className="btn-task-cate" type="primary">{type === "add" ? "Thêm" : "Lưu"}</Button>
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
    allTaskCates: state.taskCate.allTaskCates,
})

const actionCreators = {
    getAllTaskCates: taskCateActions.getAllTaskCates,
    addTaskCate: taskCateActions.addTaskCate,
    editTaskCate: taskCateActions.editTaskCate
}
export default connect(mapStateToProps, actionCreators)(DataFormTaskCate);
