import React from "react";
import './Task.css';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { connect } from 'react-redux';
import moment from 'moment';

import TaskList from './TaskList/TaskList'
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover, Spin } from "antd";
import { PlusOutlined, HomeOutlined, CaretRightOutlined, BellOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import FormCreateTask from "./AddTask/AddTask";

import { Link } from "react-router-dom";
import { taskActions } from "../../actions/task.actions";
import { taskCateActions } from "../../actions/task.cate.actions";
import { familyActions } from "../../actions/family.actions";
import { alertActions } from "../../actions/alert.actions";
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL'
import HeaderMain from "../Common/HeaderMain/HeaderMain";
import FilterMain from "../Common/FilterMain/FilterMain";


const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;
let socket;

class Task extends React.Component {
    state = {
        visibleFormCreateTask: false,
        listTaskCate: [],
        listMembers: [],
        dataListTask: [],
        idChosenTaskCate: 'all',
        idChosenMember: 'all',
        visiblePopover: false,
        filterBy: 'cate',
        isChanged: false,
        message: "Message",
        date: "NULL",
        n: "NULL",
        connect: "NULL",
        quickFilter: { mem: 'all', time: 'newest' },
        visiblePopoverQuickFilter: false,
    }

    componentDidMount() {
        const { getAllTasks, getAllTaskCates, getListMembers, allTasks } = this.props;

        getAllTasks();
        getAllTaskCates();
        getListMembers();

        const { token } = this.props;
        this.setState({ dataListTask: allTasks });
        socket = socketIOClient(apiUrlTypes.heroku);

        socket.on('connect', function () {
            socket.emit('authenticate', { token });
        });

        socket.on("authenticate", (res) => {
            this.setState({ connect: res.message });
        });

        //Change data of members
        socket.on("Member", data => {
            if (data) {
                const { getListMembers } = this.props;
                getListMembers();
            }
        })

        //Change data of Task
        socket.on("Task", data => {

            if (data) {
                const { getAllTasks } = this.props;
                getAllTasks();
            }
        });

        socket.on("reminder", data => {

            this.setState({ message: data.name });
            const { remindTaskNotification } = this.props;
            remindTaskNotification(data);
        });

        socket.on("nudge", data => {

            this.setState({ n: data.message });
            const { getAndSetNotificationTask, nudgeTaskNotification } = this.props;
            getAndSetNotificationTask(data);
            nudgeTaskNotification(data);
        });
    }

    hidePopoverQuickFilter = () => {
        this.setState({ visiblePopoverQuickFilter: false });
    }

    onChangeSelectMember = (value) => {
        const { quickFilter } = this.state;
        const { user, allTasks } = this.props;
        if (value === 'all') {
            this.setState({ quickFilter: { ...quickFilter, mem: value }, dataListTask: allTasks, isChanged: true });
        } else if (value === 'recentUser') {
            this.setState({
                quickFilter: { ...quickFilter, mem: value }, isChanged: true,
                dataListTask: allTasks.filter(item => item.assign && item.assign.mAssigns.some(member => member.mID._id === user._id))
            })
        }
    }

    handleVisiblePopoverChangeQuickFilter = visiblePopoverQuickFilter => {
        this.setState({ visiblePopoverQuickFilter });
    };

    onChangeSelectTime = (value) => {

    }


    componentWillReceiveProps(nextProps) {
        const { getAllTasks } = this.props;
        nextProps.messageType === 'success' ? getAllTasks() : null
    }

    componentWillUnmount() {
        socket && socket.connected && socket.close();
    }

    hidePopover = () => {
        this.setState({ visiblePopover: false })
    }

    handleVisibleChangePopover = visiblePopover => {
        this.setState({ visiblePopover });
    };

    showFormCreateTask = () => {
        this.setState({
            visibleFormCreateTask: true,
        });
    };
    handleOk = e => {
        this.setState({
            visibleFormCreateTask: false,
        });
    };

    handleCancel = e => {

        this.setState({
            visibleFormCreateTask: false,
        });
    };

    handleSearchData = (data) => {
        this.setState({ dataListTask: data, isChanged: true })
    }

    shouldComponentRender() {
        const { loadingMember, loadingTask, loadingTaskCate } = this.props;
        if (loadingMember || loadingTask || loadingTaskCate)
            return false
        return true
    }

    handleSelectFilter = (filter) => {
        const { allTasks } = this.props;

        if (filter !== 'all') {
            if (allTasks) {
                var tempFilter = allTasks.filter(itemTask => {
                    var result = false;
                    if (itemTask.tcID && itemTask.tcID._id === filter) {
                        result = true;
                    }
                    else if (itemTask.assign) {
                        if (itemTask.assign.mAssigns.some(item => item.mID._id === filter)) {
                            result = true;
                        }
                    }
                    return result;
                })

                this.setState({ dataListTask: tempFilter, isChanged: true });
            }
        } else {
            this.setState({ dataListTask: allTasks, isChanged: true });
        }

    }

    // filterTodoTaskToday = (listTask) => {
    //     let resultTodoTaskToday = [];

    //     resultTodoTaskToday = listTask.filter(itemTask => {
    //         if (itemTask.state === 'todo') {
    //             return true
    //         }
    //         else if (itemTask.state === 'upcoming') {
    //             let today = moment().endOf('day');
    //             if (moment(itemTask.repeat.start) < today) {
    //                 return true
    //             }
    //         }
    //         return false;
    //     })

    //     //list task with dueDate (todo) or start time (upcoming)


    //     // sort list item todo task by increase time
    //     return listTaskWithDueDate.sort(function (a, b) {
    //         return moment(a.timeStart) - moment(b.timeStart);
    //     })
    // }

    render() {
        const { dataListTask,
            isChanged,
            quickFilter, visiblePopover, visiblePopoverQuickFilter } = this.state;

        const { allTasks, listMembers, allTaskCates, user } = this.props;

        let tempDataTask = allTasks;
        if (isChanged === true) {
            tempDataTask = dataListTask;
        }

        const dataTodoTasks = tempDataTask.filter(item => item.state === 'todo') || [];
        const dataCompletedTasks = tempDataTask.filter(item => item.state === 'completed') || [];
        const dataUpcomingTasks = tempDataTask.filter(item => item.state === 'upcoming') || [];
        const dataLateTasks = tempDataTask.filter(item => item.state === 'late') || [];
        return (
            <div>
                <Layout style={{ minHeight: '100vh', position: 'relative' }}>

                    <DashboardMenu menuItem="3" />
                    <Layout className="site-layout">
                        <Header className="header-container" >
                            <HeaderMain tab="task" title="Công việc" handleSearchData={this.handleSearchData}
                                tabData={allTasks} />
                        </Header>

                        <Content className="task__content">
                            <div className="task__content-container">
                                {/* //filter task */}
                                <div className="task__filter">
                                    <FilterMain tab='task' allMembers={listMembers ? listMembers : []} allCates={allTaskCates ? allTaskCates : []} handleSelectFilter={this.handleSelectFilter} />
                                </div>

                                <Tabs defaultActiveKey="todo" style={{ marginTop: '-10px' }} className="task__tabs-data" tabBarExtraContent={
                                    <div className="quick-filter">
                                        {/* <div className={`quick-filter__item ${quickFilter !== 'all' ? 'quick-filter__chosen-item' : null}`}
                                       onClick={() => { this.handleClickQuickFilter('recentUser') }} >
                                       Được giao
                                   </div>
                                   <div className={`quick-filter__item ${quickFilter === 'all' ? 'quick-filter__chosen-item' : null}`}
                                       onClick={() => { this.handleClickQuickFilter('all') }}>
                                       Tất cả
                                   </div> */}
                                        <div className="quick-filter__tablet-pc">
                                            <Select onChange={this.onChangeSelectMember} defaultValue="all" allowClear className="quick-filter__item" placeholder="Thành viên">
                                                <Option value="all">Tất cả thành viên</Option>
                                                <Option value="recentUser">Được giao</Option>
                                            </Select>
                                            <Select onChange={this.onChangeSelectTime} allowClear defaultValue="oldest" placeholder="Thời gian" className="quick-filter__item">
                                                <Option value="newest">Mới nhất</Option>
                                                <Option value="oldest">Cũ nhất</Option>
                                            </Select>

                                        </div>
                                        <Popover trigger="click"
                                            visible={visiblePopoverQuickFilter} onVisibleChange={this.handleVisiblePopoverChangeQuickFilter}
                                            className="quick-filter__mobile" placement="bottomRight"
                                            content={<div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Select size="small" onChange={this.onChangeSelectMember} defaultValue="all" allowClear className="quick-filter__item" placeholder="Thành viên">
                                                    <Option value="all">Tất cả thành viên</Option>
                                                    <Option value="recentUser">Được giao</Option>
                                                </Select>
                                                <Select size="small" allowClear defaultValue="newest" placeholder="Thời gian" className="quick-filter__item">
                                                    <Option value="newest">Mới nhất</Option>
                                                    <Option value="oldest">Cũ nhất</Option>
                                                </Select>

                                                <Button size="small" type="primary" ghost className="quick-filter__item"
                                                    onClick={this.hidePopoverQuickFilter} icon={<CloseOutlined />}></Button>
                                            </div>
                                            }>
                                            <Button size="small" type="primary" ghost>Tùy chọn lọc</Button>
                                        </Popover>
                                    </div>

                                }>
                                    <TabPane tab="CẦN LÀM" key="todo">
                                        <TaskList key="p1" dataTasks={dataTodoTasks} type="today" />
                                    </TabPane>
                                    <TabPane tab="SẮP TỚI" key="upcoming">
                                        <TaskList key="p2" dataTasks={dataUpcomingTasks} type="upcoming" />
                                    </TabPane>
                                    <TabPane tab="ĐÃ XONG" key="completed">
                                        <TaskList key="p3" dataTasks={dataCompletedTasks.reverse()} type="done" />
                                    </TabPane>
                                    <TabPane tab="BỊ TRỄ" key="late">
                                        <TaskList key="p4" dataTasks={dataLateTasks.reverse()} type="late" />
                                    </TabPane>

                                </Tabs>
                            </div>
                            <Modal title="Add task" style={{ maxWidth: 600, top: '10px' }}
                                visible={this.state.visibleFormCreateTask}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}>
                                <FormCreateTask />
                            </Modal>
                        </Content>
                    </Layout>
                </Layout >
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    deleted: state.task.deleted,
    actionTask: state.task.actionTask,
    user: state.authentication.inforLogin.user,
    token: state.authentication.inforLogin.token,
    messageType: state.alert.type,
    messageAlert: state.alert.message,
    allTasks: state.task.allTasks,
    listMembers: state.family.listMembers,
    allTaskCates: state.taskCate.allTaskCates,
    loadingTask: state.task.loading,
    loadingGetAllTask: state.task.loadingGetAllTask,
    loadingMember: state.family.loading,
    loadingTaskCate: state.taskCate.loading,
    idCommonTaskCate: state.taskCate.idCommonTaskCate,

})
const actionCreators = {
    getAllTasks: taskActions.getAllTasks,
    getAllTaskCates: taskCateActions.getAllTaskCates,
    getListMembers: familyActions.getListMembers,
    getAndSetNotificationTask: taskActions.getAndSetNotificationTask,
    nudgeTaskNotification: alertActions.nudgeTaskNotification,
    remindTaskNotification: alertActions.remindTaskNotification,
}

export default connect(mapStateToProps, actionCreators)(Task);