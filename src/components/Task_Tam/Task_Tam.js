import React from "react";

import './Task.css';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import axios from 'axios';

import TaskList from './TaskList/TaskList'
import { Layout, Breadcrumb, Row, Col, Input, Button, Tabs, Collapse, Modal } from "antd";
import { PlusOutlined, SearchOutlined, HomeOutlined, CaretRightOutlined, AlertOutlined, BellOutlined } from '@ant-design/icons';
import FormCreateTask from "./FormCreateTask/FormCreateTask";
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

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k';
class Task extends React.Component {
    state = {
        visibleFormCreateTask: false,
        dataListTask: []
    }

    componentDidMount() {
        axios.get(
            'https://datn-house-helper-app.herokuapp.com/list-task', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ dataListTask: data.listTasks });
            })
            .catch(err => console.log(err));

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

        const { dataListTask } = this.state;
        console.log('data list task', dataListTask);

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
                                <Button onClick={this.showFormCreateTask} size="large"><PlusOutlined style={{ fontSize: 19 }} /></Button>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '20px 16px' }}>

                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1', '2']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                className="site-collapse-custom-collapse"
                            >
                                <Panel header="To-do" key="1" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataTodoTasks} />
                                </Panel>
                                <Panel header="Completed" key="2" className="site-collapse-custom-panel">
                                    <TaskList dataTasks={dataCompletedTasks} />
                                </Panel>
                                <Panel header="Suggestions" key="3" className="site-collapse-custom-panel">
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

export default Task;