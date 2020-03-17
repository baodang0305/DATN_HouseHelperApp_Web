import React from "react";
import './Task.css';

import TaskList from './TaskList/TaskList'
import { Layout, Breadcrumb, Row, Col, Input, Button, Tabs, Collapse, Modal } from "antd";
import { PlusOutlined, SearchOutlined, HomeOutlined, CaretRightOutlined, AlertOutlined, BellOutlined } from '@ant-design/icons';
import FormCreateTask from "./FormCreateTask/FormCreateTask";

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
        hiddenInputSearch: true,
        visibleFormCreateTask: false
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
        const { hiddenInputSearch } = this.state;
        return (
            <Layout className="site-layout">
                <Header className="site-layout-background header-tasks">
                    {/* <div><SearchOutlined className="icon-search" /></div> */}
                    <Row style={{ width: '100%' }}>
                        <Col span={10} className="header-part-left" >
                            <Button style={{ marginRight: 10 }}><HomeOutlined style={{ fontSize: 19 }} /></Button>
                            <Search className="search-task"
                                placeholder="Input something"
                                onSearch={value => console.log(value)}
                                style={{ width: 200 }}
                            />
                        </Col>
                        <Col span={4} className="header-title">Tasks</Col>


                        <Col span={10} className="header-part-right">
                            <Button style={{ marginRight: 10 }}><BellOutlined style={{ fontSize: 19 }} /></Button>
                            <Button onClick={this.showFormCreateTask}><PlusOutlined style={{ fontSize: 19 }} /></Button>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '20px 16px' }}>

                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>

                        <Collapse
                            bordered={false}
                            defaultActiveKey={['1']}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            className="site-collapse-custom-collapse"
                        >
                            <Panel header="To-do" key="1" className="site-collapse-custom-panel">
                                <TaskList />
                            </Panel>
                            <Panel header="Completed" key="2" className="site-collapse-custom-panel">
                                <TaskList />
                            </Panel>
                            <Panel header="Suggestions" key="3" className="site-collapse-custom-panel">
                                <TaskList />
                            </Panel>
                        </Collapse>
                    </div>
                    <Modal title="Add task" style={{ maxWidth: 400, top: '10%' }}
                        visible={this.state.visibleFormCreateTask}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}>
                        <FormCreateTask />
                    </Modal>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout >
        );
    }
}

export default Task;