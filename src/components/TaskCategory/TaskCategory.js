import React, { Component } from 'react'
import { Layout, Avatar, Row, Col, Input, Button, Modal, Tooltip, Spin, List } from "antd";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { PlusOutlined, InfoCircleOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import HeaderMain from '../Common/HeaderMain/HeaderMain';
import { taskActions } from "../../actions/task.actions";
import { taskCateActions } from "../../actions/task.cate.actions";
import { familyActions } from "../../actions/family.actions";
import './TaskCategory.css';
import history from '../../helpers/history';

const { Search } = Input;
const { Header, Content, Footer } = Layout;

class TaskCategory extends Component {
    state = {
        visibleFormDeleteTaskCate: false,
        numberTasks: [],
        recentItem: null,
        idChosenReplace: null,
        hasChange: false
    };

    componentWillMount() {
        const { getAllTasks, getListMembers, getAllTaskCates } = this.props;
        getAllTaskCates();
        getListMembers();
        getAllTasks();
    }

    componentDidMount() {
        const { numberTasks, hasChange } = this.state;
        hasChange ? getAllTaskCates() : null
    }

    handleChooseReplaceCate = (idReplace) => {
        this.setState({ idChosenReplace: idReplace });
    }

    handleDeleteTaskCate = () => {
        const { deleteTaskCate, getAllTaskCates } = this.props;
        const { recentItem, idChosenReplace } = this.state;
        deleteTaskCate(recentItem._id, idChosenReplace);
        this.setState({ visibleFormDeleteTaskCate: false, hasChange: true });
    }

    handleEditTaskCateAction = (chosenCateToEdit) => {
        this.setState({ recentItem: chosenCateToEdit });
        history.push({ pathname: '/edit-task-category', state: { chosenCateToEdit } });
    }

    shouldComponentRender() {
        const { loadingMember, loadingTask, loadingTaskCate } = this.props;
        if (loadingMember || loadingTask || loadingTaskCate)
            return false
        return true
    }

    calculateNumberTaskEachCate = (allTaskCates, allTasks) => {
        let temp = [];
        allTaskCates.forEach(element => {
            temp.push({
                taskCategory: element,
                tasksEachCate: [
                    { typeTask: 'Cần làm', color: '#2985ff', numberTasks: Number(allTasks.filter(i => i.tcID._id === element._id && i.state === 'todo').length) },
                    { typeTask: 'Đã xong', color: '#52c41a', numberTasks: Number(allTasks.filter(i => i.tcID._id === element._id && i.state === 'completed').length) },
                    { typeTask: 'Sắp tới', color: '#13c2c2', numberTasks: Number(allTasks.filter(i => i.tcID._id === element._id && i.state === 'upcoming').length) }
                ]
            })
        });
        return temp;
    }

    render() {
        const { allTaskCates, allTasks } = this.props;
        const calculatedNumberTaskEachCate = this.calculateNumberTaskEachCate(allTaskCates, allTasks);
        console.log('Du lieu', calculatedNumberTaskEachCate);
        const { visibleFormDeleteTaskCate, recentItem, idChosenReplace } = this.state;
        return (
            <div>
                <Layout style={{ minHeight: '100vh', position: 'relative' }}>
                    <DashboardMenu menuItem="1" />
                    <Layout className="site-layout">
                        <Header className="header-container">
                            <HeaderMain tab="taskCategory" title="Loại công việc" />
                        </Header>

                        <Content className="task-cate__content">
                            <div className="site-layout-background task-cate__content-container">
                                {/* //filter by category */}
                                {this.shouldComponentRender()
                                    ? <div className="task-cate__container">
                                        <div className="task-cate__header-container">
                                            <div className="task-cate__header-title">Danh sách loại công việc hiện tại</div>
                                            <div className="filter-task-cate"></div>
                                        </div>
                                        <List className="task-cate__list-container"
                                            size="large"
                                            dataSource={calculatedNumberTaskEachCate}
                                            renderItem={item =>
                                                <List.Item style={{ padding: '10px 0', position: 'relative' }} key={item.taskCategory._id}>
                                                    <div className="task-cate__item-container">
                                                        {/* //information of task category contain image and task category's name */}
                                                        <div className="task-cate__infor-cate">
                                                            <Avatar className="task-cate__image-cate" src={item.taskCategory.image} />
                                                            <div className="task-cate__name-cate">
                                                                {item.taskCategory.name}
                                                            </div>
                                                        </div>

                                                        {/* //information of task category contain number of task belong this one */}
                                                        <div className="container-relative-infor-task-cate">
                                                            {item.tasksEachCate.map(i =>
                                                                <div className="relative-infor-task-cate">
                                                                    <div style={{ backgroundColor: i.color }} className="number-task-of-cate">{i.numberTasks}</div>
                                                                    <div className="label-type-of-task">{i.typeTask}</div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* //some action to task category */}
                                                        <div className="actions-task-cate">
                                                            <div className="action-item-task-cate">
                                                                <EditOutlined className="icon-action-task-cate"
                                                                    style={{ color: '#2f54eb' }}
                                                                    onClick={() => this.handleEditTaskCateAction(item.taskCategory)} />
                                                                <div className="task-cate__title-action">Sửa</div>
                                                            </div>
                                                            <div className="action-item-task-cate" onClick={(e) => this.setState({ visibleFormDeleteTaskCate: true, recentItem: item.taskCategory })}>
                                                                <DeleteOutlined className="icon-action-task-cate" style={{ color: '#f5222d' }} />
                                                                <div className="task-cate__title-action">Xóa</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </List.Item>}
                                        />

                                    </div>
                                    : <div className="spin-get-list-members loading-data"><Spin tip="Đang tải..." /> </div>}
                            </div>

                            {/* Form delete task category */}
                            <Modal
                                visible={visibleFormDeleteTaskCate}
                                footer={null}
                                maskClosable={false}
                                onCancel={(e) => this.setState({ visibleFormDeleteTaskCate: false })}>
                                <div className="container-form-delete-task-cate">
                                    {recentItem ? <div className="show-recent-task-cate">
                                        <div className="label-form-delete-task-cate">Loại công việc hiện tại muốn xóa:</div>
                                        <Avatar src={recentItem.image} />
                                        <div>{recentItem.name}</div>
                                    </div> : null}
                                    <div className="show-task-cate-replace">
                                        <div className="label-form-delete-task-cate">
                                            <div>Chọn loại công việc thay thế:</div>

                                            <Tooltip placement="top" title="Các công việc của loại muốn xóa sẽ chuyển sang loại công việc thay thế">
                                                <InfoCircleOutlined style={{ fontSize: 18, marginLeft: 10 }} />
                                            </Tooltip>

                                        </div>
                                        <Row style={{ width: '100%' }} justify="center" gutter={[10, 10]}>
                                            {recentItem ? allTaskCates.map(item => {
                                                return item._id === recentItem._id
                                                    ? null
                                                    : <Col span={6} className="item-cate-replace-delete" key={item._id}>
                                                        <div className="container-item-cate-replace-delete"
                                                            onClick={() => this.handleChooseReplaceCate(item._id)}>
                                                            <div className="container-image-item-cate-replace-delete">
                                                                <Avatar className={item._id === idChosenReplace ? "checked-task-cate" : "image-item-cate-replace-delete"} src={item.image} />
                                                                {item._id === idChosenReplace ? <CheckCircleOutlined className="assignment-checked" /> : null}
                                                            </div>
                                                            <div>{item.name}</div>
                                                        </div>
                                                    </Col>
                                            }) : null}
                                        </Row>
                                    </div>
                                    <div className="btn-submit">
                                        <Button type="default" onClick={() => this.setState({ visibleFormDeleteTaskCate: false })}>Hủy bỏ</Button>
                                        <Button type="danger"
                                            onClick={() => this.handleDeleteTaskCate()}
                                            style={{ marginLeft: 10 }}>Xác nhận</Button>
                                    </div>
                                </div>
                            </Modal>
                        </Content>
                    </Layout>
                </Layout >
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.inforLogin.user,
    allTasks: state.task.allTasks,
    listMembers: state.family.listMembers,
    allTaskCates: state.taskCate.allTaskCates,
    loadingTask: state.task.loading,
    loadingGetAllTask: state.task.loadingGetAllTask,
    loadingMember: state.family.loading,
    loadingTaskCate: state.taskCate.loading,
    successActionTaskCate: state.taskCate.successActionTaskCate
})

const actionCreators = {
    getAllTasks: taskActions.getAllTasks,
    getAllTaskCates: taskCateActions.getAllTaskCates,
    getListMembers: familyActions.getListMembers,
    deleteTaskCate: taskCateActions.deleteTaskCate,
}
export default connect(mapStateToProps, actionCreators)(TaskCategory);