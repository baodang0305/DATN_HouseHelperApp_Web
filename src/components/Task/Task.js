import React from "react";

import './Task.css';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import axios from 'axios';
import { connect } from 'react-redux';

import TaskList from './TaskList/TaskList'
import { Layout, Avatar, Breadcrumb, Row, Col, Input, Button, Tabs, Collapse, Modal, Select } from "antd";
import { PlusOutlined, SearchOutlined, HomeOutlined, CaretRightOutlined, AlertOutlined, BellOutlined } from '@ant-design/icons';
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
        dataListTask: []
    }

    getData() {
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-task', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ dataListTask: data.listTasks.reverse() });
            })
            .catch(err => console.log(err));
    }
    componentDidMount() {
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-task-category', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ listTaskCate: data.listTaskCategories });
            })
            .catch(err => console.log(err));
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        nextProps.messageType === 'success' ? this.getData() : null
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


    render() {

        const { dataListTask, listTaskCate } = this.state;
        console.log(dataListTask)

        const dataTodoTasks = dataListTask.filter(item => item.state === 'todo')
        const dataCompletedTasks = dataListTask.filter(item => item.state === 'completed')
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
                            <Col span={4} className="header-title">Tasks</Col>


                            <Col span={10} className="header-part-right">
                                <Button style={{ marginRight: 10 }} size="large"><BellOutlined style={{ fontSize: 19 }} /></Button>
                                <Button size="large"><Link to='/tasks/add-task' className="btn-link"><PlusOutlined style={{ fontSize: 19 }} /></Link></Button>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '20px 20px' }}>

                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <div className="filter-list-task">
                                <div className="list-cate-task">
                                    <Avatar src="https://media.istockphoto.com/vectors/small-house-icon-home-icon-vector-design-vector-id810190800?k=6&m=810190800&s=170667a&w=0&h=s2doFETLvYcb70M2_k_BOBaasGYrnuAuPfwArxJUK_Y="
                                        className="task-cate" />
                                    <div>All</div>
                                </div>
                                {listTaskCate.map(item =>
                                    (<div className="list-cate-task">
                                        <Avatar src={item.image} className="task-cate"></Avatar>
                                        <div>{item.name}</div>
                                    </div>))}
                                <div className="list-cate-task">
                                    <Avatar src="https://static.thenounproject.com/png/1701541-200.png" className="task-cate"></Avatar>
                                    <div>Filter</div>
                                </div>
                            </div>
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1', '2']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                className="site-collapse-custom-collapse"
                            >

                                <Panel
                                    header={<div className="header-list-task">
                                        <div className="title-header-list-task">
                                            To do
                                        </div>
                                        <div className="number-of-task">{dataTodoTasks.length}</div>
                                    </div>} key="1" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataTodoTasks} />
                                </Panel>
                                <Panel header={<div className="header-list-task">
                                    <div className="title-header-list-task">
                                        Completed
                                        </div>
                                    <div className="number-of-task">{dataCompletedTasks.length}</div>
                                </div>} key="2" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataCompletedTasks} />
                                </Panel>
                                <Panel header={<div className="header-list-task">
                                    <div className="title-header-list-task">
                                        Dismissed
                                        </div>
                                    <div className="number-of-task">0</div>
                                </div>} key="3" className="site-collapse-custom-panel">
                                    <TaskList />
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
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>

            </Layout >

        );
    }
}
const mapStateToProps = (state) => ({
    deleted: state.task.deleted,
    actionTask: state.task.actionTask,
    user: state.authentication.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message
})


export default connect(mapStateToProps, null)(Task);