import React from "react";

import './Task.css';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import axios from 'axios';
import { connect } from 'react-redux';

import TaskList from './TaskList/TaskList'
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover } from "antd";
import { PlusOutlined, HomeOutlined, CaretRightOutlined, BellOutlined } from '@ant-design/icons';
import FormCreateTask from "./AddTask/AddTask";
import token from '../../helpers/token'
import { Link } from "react-router-dom";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;


const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

class Task extends React.Component {
    state = {
        visibleFormCreateTask: false,
        listTaskCate: [],
        listMembers: [],
        dataListTask: [],
        allTasks: [],
        idChosenTaskCate: null,
        idChosenMember: 'all',
        visiblePopover: false,
        filterBy: 'cate',
    }

    hidePopover = () => {
        this.setState({ visiblePopover: false })
    }
    handleVisibleChangePopover = visiblePopover => {
        this.setState({ visiblePopover });
    };
    getDataTask() {
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-task', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ dataListTask: data.listTasks.reverse(), allTasks: data.listTasks.reverse() });
            })
            .catch(err => console.log(err));
    }

    getDataTaskCate() {
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-task-category', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                //Arrange the list task cate to common task cate is arranged at the 1st element
                let indexCommonTaskCate = data.listTaskCategories.findIndex(item => item.name === 'Phổ biến');
                let idCommonTaskCate = data.listTaskCategories[indexCommonTaskCate]._id;
                let tempList = data.listTaskCategories;
                if (indexCommonTaskCate !== -1) {
                    let temp = tempList[0];
                    tempList[0] = tempList[indexCommonTaskCate];
                    tempList[indexCommonTaskCate] = temp;
                }

                this.setState({ listTaskCate: tempList, idChosenTaskCate: idCommonTaskCate });
            })
            .catch(err => console.log(err));
    }

    getDataMember() {
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-member', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ listMembers: data.listMembers });
            })
            .catch(err => console.log(err));
    }
    componentDidMount() {
        this.getDataTaskCate();
        this.getDataMember();
        this.getDataTask();
    }

    componentWillReceiveProps(nextProps) {
        nextProps.messageType === 'success' ? this.getDataTask() : null
    }
    showFormCreateTask = () => {
        this.setState({
            visibleFormCreateTask: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visibleFormCreateTask: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visibleFormCreateTask: false,
        });
    };

    handleChangeSelectFilterTaskCate(idTaskCate) {
        const { listTaskCate, allTasks } = this.state;

        const idCommonCate = listTaskCate[listTaskCate.findIndex(item => item.name === 'Phổ biến')]._id;
        if (idTaskCate === idCommonCate) {
            this.setState({ idChosenTaskCate: idTaskCate, dataListTask: allTasks });
        }
        else {
            let tempListTaskFilter = allTasks.filter(item => item.tcID._id === idTaskCate)
            this.setState({ idChosenTaskCate: idTaskCate, dataListTask: tempListTaskFilter });
        }
    }

    handleChangeSelectFilterMember(idMember) {
        const { listMembers, allTasks } = this.state;

        if (idMember === 'all') {
            this.setState({ idChosenMember: idMember, dataListTask: allTasks });
        }
        else {
            console.log(this.state.idChosenMember, idMember);
            let tempListTaskFilter = allTasks.filter(item => item.assign !== null).filter(item => item.assign.mAssigns.findIndex(i => i.mID._id === idMember) !== -1 ? true : false);
            console.log('danh sách theo member', listMembers, idMember, tempListTaskFilter);
            this.setState({ idChosenMember: idMember, dataListTask: tempListTaskFilter });
        }

    }

    handleChangeFilterBy = (filterBy) => {
        const { listMembers, allTasks, listTaskCate } = this.state;
        const idCommonCate = listTaskCate[listTaskCate.findIndex(item => item.name === 'Phổ biến')]._id;
        const idChosenAllMember = 'all';

        filterBy !== this.state.filterBy ?
            filterBy === 'cate'
                ? this.setState({ filterBy: filterBy, idChosenTaskCate: idCommonCate, dataListTask: allTasks })
                : this.setState({ filterBy: filterBy, idChosenMember: idChosenAllMember, dataListTask: allTasks })
            : null
        this.hidePopover();
    }
    render() {

        const { dataListTask, listTaskCate, idChosenTaskCate, idChosenMember, listMembers, filterBy } = this.state;
        const { user } = this.props;
        const dataTodoTasks = dataListTask.filter(item => item.state === 'todo')
        const dataCompletedTasks = dataListTask.filter(item => item.state === 'completed')
        const dataUpcomingTasks = dataListTask.filter(item => item.state === 'upcoming')

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="3" />
                <Layout className="site-layout">
                    <Header className="site-layout-background header-tasks">
                        {/* <div><SearchOutlined className="icon-search" /></div> */}
                        <Row style={{ width: '100%' }}>
                            <Col span={10} className="header-part-left" >
                                <Button style={{ marginRight: 10 }} size="large">
                                    <Link to='/family' className="btn-link"><HomeOutlined style={{ fontSize: 19 }} /></Link></Button>
                                <Search className="search-task"
                                    placeholder="Input something"
                                    onSearch={value => console.log(value)}
                                    style={{ width: 200 }}
                                    size="large"
                                />
                            </Col>
                            <Col span={4} className="header-title">Công việc</Col>


                            <Col span={10} className="header-part-right">
                                <Button style={{ marginRight: 10 }} size="large"><BellOutlined style={{ fontSize: 19 }} /></Button>
                                {user.mIsAdmin === true ? <Button size="large"><Link to='/tasks/add-task' className="btn-link"><PlusOutlined style={{ fontSize: 19 }} /></Link></Button> : null}
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '20px 20px' }}>

                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {/* //filter by category */}
                            <div className="filter-list-task">
                                {filterBy === 'member' ? <div className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterMember('all')}>
                                    <Avatar src="https://i.pinimg.com/236x/27/31/e2/2731e233cb4d6580373e2fe205f565ae.jpg" className={idChosenMember === 'all' ? "chosen-task-filter" : "task-filter"}></Avatar>
                                    <div>Tất cả</div>
                                </div> : null}
                                {filterBy === 'cate'
                                    ? listTaskCate.map(item =>
                                        (<div className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterTaskCate(item._id)}>
                                            <Avatar src={item.image} className={idChosenTaskCate === item._id ? "chosen-task-filter" : "task-filter"}></Avatar>
                                            <div>{item.name}</div>
                                        </div>))
                                    :
                                    listMembers.map(item =>
                                        (<div className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterMember(item._id)}>
                                            <Avatar src={item.mAvatar.image} className={idChosenMember === item._id ? "chosen-task-filter" : "task-filter"}></Avatar>
                                            <div>{item.mName}</div>
                                        </div>))
                                }
                                {/* Change type filter */}
                                <Popover
                                    className="filter-popover-task"
                                    placement="bottom"

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


                            <Collapse
                                style={{ borderTop: '1px solid #EAF0F3', backgroundColor: 'white' }}
                                bordered={false}
                                defaultActiveKey={['1']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                className="site-collapse-custom-collapse"
                            >
                                <Panel
                                    header={<div className="header-list-task">
                                        <div className="title-header-list-task">
                                            Công việc cần làm
                                        </div>
                                        <div className="number-of-task">{dataTodoTasks.length}</div>
                                    </div>} key="1" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataTodoTasks} />
                                </Panel>
                                <Panel header={<div className="header-list-task">
                                    <div className="title-header-list-task">
                                        Sắp tới
                                        </div>
                                    <div className="number-of-task">{dataUpcomingTasks.length}</div>
                                </div>} key="2" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataUpcomingTasks} />
                                </Panel>
                                <Panel header={<div className="header-list-task">
                                    <div className="title-header-list-task">
                                        Công việc đã xong
                                        </div>
                                    <div className="number-of-task">{dataCompletedTasks.length}</div>
                                </div>} key="3" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataCompletedTasks} />
                                </Panel>

                            </Collapse>
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

        );
    }
}
const mapStateToProps = (state) => ({
    deleted: state.task.deleted,
    actionTask: state.task.actionTask,
    user: state.authentication.inforLogin.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message
})


export default connect(mapStateToProps, null)(Task);