import {
    RedoOutlined,
    LeftOutlined,
    TeamOutlined,
    BellOutlined,
    CheckOutlined,
    RightOutlined,
    UploadOutlined,
    PictureOutlined,
    SnippetsOutlined,
    CalendarOutlined,
    FieldTimeOutlined,
} from "@ant-design/icons";
import React from "react";
import { Layout, Row, Col, Button, Form, Input, Avatar, DatePicker, Upload, TimePicker, Select } from "antd";

import "./AddEvent.css";
import history from "../../../helpers/history";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";

const { Option } = Select;
const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

class AddEvent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numberOfUsers: 0,
            idCurrentItem: 1
        }
        this.scrollBar = React.createRef();
    }

    componentDidMount() {
        // fetch member from data

        this.setState({ numberOfUsers: 6 });
    }

    handleClickBack = () => {
        history.push("/calendar");
    }

    handleClickPre = () => {
        const { idCurrentItem } = this.state;
        if (idCurrentItem > 1) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft - 150;
            this.setState({ idCurrentItem: idCurrentItem - 1 })
        }
    }

    handleClickNext = () => {
        const { idCurrentItem, numberOfUsers } = this.state;
        if (idCurrentItem < numberOfUsers) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft + 150;
            this.setState({ idCurrentItem: idCurrentItem + 1 });
        }
    }

    handleClickUserAssign = (id) => {
        console.log(id);
    }

    render() {

        const { numberOfUsers } = this.state;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="2" />
                <Layout className="site-layout">
                    <Header className="site-layout-background" >
                        <Row style={{ width: '100%' }}>
                            <Col span={2} className="header-part-left" >
                                <Button onClick={this.handleClickBack} style={{ marginLeft: "10px" }} size="large" >
                                    <LeftOutlined />
                                </Button>
                            </Col>
                            <Col span={20} className="header-title">Thêm Sự Kiện</Col>
                        </Row>
                    </Header>

                    <Content >
                        <Form size="large">
                            <Form.Item className="form-item-add-event">
                                <Input className="name-event-input" placeholder="Tên sự kiện" />
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <TeamOutlined className="icon-input-add-event" style={{ marginTop: 20 }} />
                                <span className="title-input-add-event"> Assign </span>
                                <Row align="middle" justify="center" style={{ marginBottom: 20 }}>
                                    {numberOfUsers > 4 && <div onClick={this.handleClickPre} className="pre-icon-add-event"> <LeftOutlined /> </div>}
                                    <div ref={this.scrollBar} className="list-users-asign-add-event-container" >
                                        <div className="user-add-event-container" >
                                            <div className="avatar-add-event-container" >
                                                <Avatar size={50} onClick={() => this.handleClickUserAssign(1)} />
                                            </div>
                                            <CheckOutlined className="check-asign-add-event" />
                                            <div>Nguyễn Văn A 1</div>
                                        </div>
                                        <div className="user-add-event-container" >
                                            <div className="avatar-add-event-container" >
                                                <Avatar size={50} onClick={() => this.handleClickUserAssign(2)} />
                                            </div>
                                            <CheckOutlined className="check-asign-add-event" />
                                            <div>Nguyễn Văn A 2</div>
                                        </div>
                                        <div className="user-add-event-container" >
                                            <div className="avatar-add-event-container">
                                                <Avatar size={50} />
                                            </div>
                                            <CheckOutlined className="check-asign-add-event" />
                                            <div>Nguyễn Văn A 3</div>
                                        </div>
                                        <div className="user-add-event-container" >
                                            <div className="avatar-add-event-container">
                                                <Avatar size={50} />
                                            </div>
                                            <CheckOutlined className="check-asign-add-event" />
                                            <div>Nguyễn Văn A 4</div>
                                        </div>
                                        <div className="user-add-event-container" >
                                            <div className="avatar-add-event-container">
                                                <Avatar size={50} />
                                            </div>
                                            <CheckOutlined className="check-asign-add-event" />
                                            <div>Nguyễn Văn A 5</div>
                                        </div>
                                        <div className="user-add-event-container" >
                                            <div className="avatar-add-event-container">
                                                <Avatar size={50} />
                                            </div>
                                            <CheckOutlined className="check-asign-add-event" />
                                            <div>Nguyễn Văn A 6</div>
                                        </div>

                                    </div>
                                    {numberOfUsers > 4 && <div onClick={this.handleClickNext} className="next-icon-add-event"> <RightOutlined /> </div>}
                                </Row>
                            </Form.Item>

                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <CalendarOutlined className="icon-input-add-event" />
                                    Ngày
                                </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <DatePicker className="width-70-percent" placeholder="Chọn ngày" />
                                    </Col>
                                </Row>
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <FieldTimeOutlined className="icon-input-add-event" />
                                    Bắt đầu lúc
                                </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <TimePicker className="width-70-percent" placeholder="Chọn giờ bắt đầu" use12Hours format="h:mm a" onChange={() => console.log("1")} />
                                    </Col>
                                </Row>
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <FieldTimeOutlined className="icon-input-add-event" />
                                    Kết thúc lúc
                                </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <TimePicker className="width-70-percent" placeholder="Chọn giờ kết thúc" use12Hours format="h:mm a" onChange={() => console.log("2")} />
                                    </Col>
                                </Row>
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <BellOutlined className="icon-input-add-event" />
                                    Nhắc nhở
                                </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <TimePicker className="width-70-percent" placeholder="Chọn giờ nhắc nhở" use12Hours format="h:mm a" onChange={() => console.log("2")} />
                                    </Col>
                                </Row>
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <RedoOutlined className="icon-input-add-event" />
                                    Lặp lại
                                </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <Select style={{ width: "70%" }} defaultValue="Mỗi năm" onChange={() => console.log("3")}>
                                            <Option value="jack">Mỗi năm</Option>
                                            <Option value="jack">Mỗi tháng</Option>
                                            <Option value="jack">Mỗi tuần</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event" >
                                        <PictureOutlined className="icon-input-add-event" />
                                    Hình ảnh
                                </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <Upload style={{ width: "70%" }}>
                                            <Button >
                                                <UploadOutlined /> Thêm hình ảnh
                                        </Button>
                                        </Upload>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event">
                                    <div className="title-input-add-event">
                                        <SnippetsOutlined className="icon-input-add-event" />
                                    Ghi chú
                                </div>
                                    <TextArea style={{ margin: "5px 20px 0px 20px" }} autoSize />
                                </Row>
                            </Form.Item>

                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event" style={{ float: "right", marginRight: 20 }}>
                                    <Button type="primary" ghost size="large"> Hủy </Button>
                                &emsp;
                                <Button htmlType="submit" type="primary" size="large"> Thêm </Button>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
            </Layout >
        )
    }
}

export default AddEvent;