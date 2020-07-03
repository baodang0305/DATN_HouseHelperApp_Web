import React from "react";
import './Task.css';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { connect } from 'react-redux';

import TaskList from './TaskList/TaskList'
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover, Spin } from "antd";
import { PlusOutlined, HomeOutlined, CaretRightOutlined, BellOutlined } from '@ant-design/icons';
import FormCreateTask from "./AddTask/AddTask";

import { Link } from "react-router-dom";
import { taskActions } from "../../actions/task.actions";
import { taskCateActions } from "../../actions/task.cate.actions";
import { familyActions } from "../../actions/family.actions";
import { alertActions } from "../../actions/alert.actions";
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL'
import HeaderMain from "../Common/HeaderMain/HeaderMain";

const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
let socket;

class Task extends React.Component {
    state = {
        visibleFormCreateTask: false,
        listTaskCate: [],
        listMembers: [],
        dataListTask: [],
        allTasks: [],
        idChosenTaskCate: 'all',
        idChosenMember: 'all',
        visiblePopover: false,
        filterBy: 'cate',
        isChanged: false,
        message: "Message",
        date: "NULL",
        n: "NULL",
        connect: "NULL",
        quickFilter: 'all',
    }

    componentDidMount() {
        const { token } = this.props;
        console.log('', token)
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
            console.log(' DU lieu socket', data);
            if (data) {
                const { getAllTasks } = this.props;
                getAllTasks();
            }
        });

        socket.on("reminder", data => {
            console.log(data);
            this.setState({ message: data.name });
            const { remindTaskNotification } = this.props;
            remindTaskNotification(data);
        });

        socket.on("nudge", data => {
            console.log(data);
            this.setState({ n: data.message });
            const { getAndSetNotificationTask, nudgeTaskNotification } = this.props;
            getAndSetNotificationTask(data);
            nudgeTaskNotification(data);
        });
    }

    componentDidMount() {
        const { getAllTasks, getAllTaskCates, getListMembers } = this.props;
        getAllTasks();
        getAllTaskCates();
        getListMembers();
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

    handleChangeSelectFilterTaskCate(idTaskCate) {
        const { allTasks, allTaskCates } = this.props;


        if (idTaskCate === 'all') {
            this.setState({ idChosenTaskCate: idTaskCate, dataListTask: allTasks, isChanged: true });
        }
        else {
            let tempListTaskFilter = allTasks.filter(item => item.tcID._id === idTaskCate)
            this.setState({ idChosenTaskCate: idTaskCate, dataListTask: tempListTaskFilter, isChanged: true });
        }
    }

    handleChangeSelectFilterMember(idMember) {
        const { listMembers, allTasks } = this.props;

        if (idMember === 'all') {
            this.setState({ idChosenMember: idMember, dataListTask: allTasks, isChanged: true });
        }
        else {
            let tempListTaskFilter = allTasks.filter(item => item.assign !== null).filter(item => item.assign.mAssigns.findIndex(i => i.mID._id === idMember) !== -1 ? true : false);
            this.setState({ idChosenMember: idMember, dataListTask: tempListTaskFilter, isChanged: true });
        }
    }

    handleChangeFilterBy = (filterBy) => {
        const { listMembers, allTasks, allTaskCates } = this.props;

        const idChosenAll = 'all';

        filterBy !== this.state.filterBy ?
            filterBy === 'cate'
                ? this.setState({ filterBy: filterBy, idChosenTaskCate: idChosenAll, dataListTask: allTasks, isChanged: true })
                : this.setState({ filterBy: filterBy, idChosenMember: idChosenAll, dataListTask: allTasks, isChanged: true })
            : null
        this.hidePopover();
    }

    shouldComponentRender() {
        const { loadingMember, loadingTask, loadingTaskCate } = this.props;
        if (loadingMember || loadingTask || loadingTaskCate)
            return false
        return true
    }

    handleClickQuickFilter = (quickFilterMode) => {
        const { quickFilter } = this.state;
        const { user, allTasks } = this.props;
        if (quickFilterMode === 'all') {
            this.setState({ quickFilter: quickFilterMode });
        } else if (quickFilterMode === 'recentUser') {
            this.setState({ quickFilter: quickFilterMode })
        }

    }
    render() {
        const { dataListTask, isChanged, idChosenTaskCate, idChosenMember, filterBy, connect, quickFilter } = this.state;
        console.log(connect)

        const { user } = this.props;
        const { allTasks, listMembers, allTaskCates } = this.props;

        let tempDataTask = quickFilter === 'all'
            ? allTasks
            : allTasks.filter(item => item.assign && item.assign.mAssigns.some(member => member.mID._id === user._id));
        if (isChanged === true) {
            tempDataTask = dataListTask;
        }

        const dataTodoTasks = tempDataTask.filter(item => item.state === 'todo');
        const dataCompletedTasks = tempDataTask.filter(item => item.state === 'completed');
        const dataUpcomingTasks = tempDataTask.filter(item => item.state === 'upcoming');

        return (
            <div>
                <Layout style={{ minHeight: '100vh', position: 'relative' }}>

                    <DashboardMenu menuItem="3" />
                    <Layout className="site-layout">
                        <Header className="header-container">
                            <HeaderMain tab="task" title="Công việc" />
                        </Header>

                        <Content className="task__content">
                            <div className="site-layout-background task__content-container">
                                {/* //filter task */}
                                <div className="filter-list-task">
                                    <div className="list-task-filter" onClick={(e) => { filterBy === 'member' ? this.handleChangeSelectFilterMember('all') : this.handleChangeSelectFilterTaskCate('all') }}>
                                        <Avatar src="https://i.pinimg.com/236x/27/31/e2/2731e233cb4d6580373e2fe205f565ae.jpg" className={idChosenMember === 'all' || idChosenTaskCate === 'all' ? "chosen-task-filter" : "task-filter"}></Avatar>
                                        <div className="filter__name-cate">Tất cả</div>
                                    </div>
                                    {filterBy === 'cate'
                                        ? allTaskCates.map(item =>
                                            (<div key={item._id} className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterTaskCate(item._id)}>
                                                <Avatar src={item.image} className={idChosenTaskCate === item._id ? "chosen-task-filter" : "task-filter"}></Avatar>
                                                <div className="filter__name-cate">{item.name}</div>
                                            </div>))
                                        : listMembers.map(item =>
                                            (<div key={item._id} className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterMember(item._id)}>
                                                <Avatar src={item.mAvatar.image} className={idChosenMember === item._id ? "chosen-task-filter" : "task-filter"}></Avatar>
                                                <div className="filter__name-cate">{item.mName}</div>
                                            </div>))
                                    }
                                    {/* Change type filter */}
                                    <Popover
                                        className="filter-popover-task"
                                        placement="bottomRight"

                                        content={
                                            <div className="filter-popover">
                                                <div className={filterBy === 'cate' ? "chosen-filter-popover-item" : "filter-popover-item"} onClick={(e) => this.handleChangeFilterBy('cate')}>Loại công việc</div>
                                                <div className={filterBy === 'member' ? "chosen-filter-popover-item" : "filter-popover-item"} onClick={(e) => this.handleChangeFilterBy('member')}>Thành viên</div>
                                                {/* <div className="hide-popover" onClick={this.hidePopover}>Đóng</div> */}
                                            </div>
                                        }
                                        title="Lọc theo:"
                                        trigger="click"
                                        visible={this.state.visiblePopover}
                                        onVisibleChange={this.handleVisibleChangePopover}
                                    >
                                        <div className="list-task-filter">
                                            <Avatar src="https://static.thenounproject.com/png/1701541-200.png" className="task-filter"></Avatar>
                                            <div>Filter</div>
                                        </div>
                                    </Popover>
                                </div>


                                {/* <Collapse
                                    style={{ borderTop: '1px solid #EAF0F3', backgroundColor: 'white' }}
                                    bordered={false}
                                    defaultActiveKey={['1']}
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                    className="site-collapse-custom-collapse"
                                >
                                    <Panel key="1" className="task__panel"
                                        header={<div className="header-list-task">
                                            <div className="title-header-list-task">
                                                Công việc cần làm
                                                </div>
                                            <div className="number-of-task">{dataTodoTasks.length}</div>
                                        </div>} className="site-collapse-custom-panel">
                                        <TaskList key="p1" dataTasks={dataTodoTasks} />
                                    </Panel>
                                    <Panel
                                        header={<div className="header-list-task">
                                            <div className="title-header-list-task">
                                                Sắp tới
                                                 </div>
                                            <div className="number-of-task">{dataUpcomingTasks.length}</div>
                                        </div>} key="2" className="site-collapse-custom-panel">
                                        <TaskList key="p2" dataTasks={dataUpcomingTasks} />
                                    </Panel>
                                    <Panel header={<div className="header-list-task">
                                        <div className="title-header-list-task">
                                            Công việc đã xong
                                            </div>
                                        <div className="number-of-task">{dataCompletedTasks.length}</div>
                                    </div>} key="3" className="site-collapse-custom-panel">
                                        <TaskList key="p3" dataTasks={dataCompletedTasks} />
                                    </Panel>
                                </Collapse> */}

                                <Tabs defaultActiveKey="todo" style={{ marginTop: '-10px' }} className="task__tabs-data" tabBarExtraContent={
                                    <div className="quick-filter">
                                        <div className={`quick-filter__item ${quickFilter !== 'all' ? 'quick-filter__chosen-item' : null}`}
                                            onClick={() => { this.handleClickQuickFilter('recentUser') }} >
                                            Được giao
                                            </div>
                                        <div className={`quick-filter__item ${quickFilter === 'all' ? 'quick-filter__chosen-item' : null}`}
                                            onClick={() => { this.handleClickQuickFilter('all') }}>
                                            Tất cả
                                            </div>
                                    </div>

                                }>
                                    <TabPane tab="CẦN LÀM" key="todo">
                                        <TaskList key="p1" dataTasks={dataTodoTasks} />
                                    </TabPane>
                                    <TabPane tab="ĐÃ XONG" key="completed">
                                        <TaskList key="p3" dataTasks={dataCompletedTasks} />
                                    </TabPane>
                                    <TabPane tab="SẮP TỚI" key="upcoming">
                                        <TaskList key="p2" dataTasks={dataUpcomingTasks} />
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