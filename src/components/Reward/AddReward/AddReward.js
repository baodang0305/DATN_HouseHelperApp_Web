import React from "react";
import { connect } from "react-redux";
import { 
    LeftOutlined, 
    PlusOutlined, 
    StarOutlined, 
    TeamOutlined, 
    RightOutlined, 
    CheckOutlined, 
    PictureOutlined, 
    UploadOutlined,
    SnippetsOutlined,
} from "@ant-design/icons";
import { Layout, Button, Input, Form, Select, Divider, Avatar, Row, Spin, Col } from "antd";

import "./AddReward.css";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from '../../../actions/family.actions';
import { alertActions } from "../../../actions/alert.actions";

const { Option } = Select;
const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

class AddReward extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: "",
            photo: null,
            assign: [],
            points: 0,
            pointItem: '',
            idCurrentItem: 1,
            currentUrlImg: "",
            pointItems: [5, 10, 15, 20]
        }
        this.scrollBar = React.createRef();
        this.inputFile = React.createRef();
    }

    componentDidMount() {
        const { getListMembers } = this.props;
        getListMembers();
    }

    handleSubmit = () => {

    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({[name]: value});
    }

    handleAssign = (mID) => {
        let { assign } = this.state;
        const indexMember = assign.findIndex(item => item === mID);
        indexMember !== -1 ?
            assign.splice(indexMember, 1)
            :
            assign = [...assign, mID];
        this.setState({ assign });
    }

    handleChangeImg = (e) => {
        this.setState({ currentUrlImg: URL.createObjectURL(e.target.files[0]), photo: e.target.files[0] });
    }

    handleClickDeleteImg = () => {
        this.inputFile.current.value = "";
        this.setState({ currentUrlImg: "", photo: null });
    }

    handlePointItemChange = (e) => {
        this.setState({ pointItem: e.target.value });
    }

    addPointItem = () => {
        let { pointItem, pointItems } = this.state;
        const { errorAlert } = this.props;
        if (pointItem && pointItem != 0) {
            const indexItem = pointItems.findIndex(item => item == pointItem);
            indexItem !== -1 
                ? errorAlert("Điểm đã tồn tại")
                : (pointItems = [...pointItems, Number(pointItem)], this.setState({pointItems}))
        }
        else {
            errorAlert("Điểm không hợp lệ")
        }
    }

    handleDeleteReward = () => {

    }

    handleClickPre = () => {
        const { idCurrentItem } = this.state;
        if (idCurrentItem > 1) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft - 160;
            this.setState({ idCurrentItem: idCurrentItem - 1 })
        }
    }

    handleClickNext = () => {

        const { idCurrentItem } = this.state;
        const { listMembers } = this.props;
        const numberOfMembers = listMembers ? listMembers.length : 0

        if (idCurrentItem < numberOfMembers) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft + 160;
            this.setState({ idCurrentItem: idCurrentItem + 1 });
        }
    }

    render() {

        const { type, gettingListMembers, gotListMembers, listMembers } = this.props;
        const { pointItems, assign, currentUrlImg, notes, name, points, pointItem } = this.state;

        const isSelectedMember = (mID) => assign && assign.findIndex(item => item === mID);

        const renderListMembers = () =>
            listMembers && listMembers.map((item, index) =>
                <div className="user-add-event-container" key={index} onClick={() => this.handleAssign(item._id)}>
                    <div className="avatar-add-event-container">
                        <Avatar
                            size={50} src={item.mAvatar.image}
                            style={{ backgroundColor: item.mAvatar.color, opacity: isSelectedMember(item._id) !== -1 && 0.5, border: "groove thin" }}
                        />
                    </div>
                    {isSelectedMember(item._id) !== -1 && <CheckOutlined className="check-asign-add-event" />}
                    <div className="name-user-add-event">{item.mName}</div>
                </div>
            )

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="4" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <div className="header-add-reward-container">
                            <div className="left-header-add-reward-container">
                                <Button onClick={this.handleClickBack} size="large" >
                                    <LeftOutlined />
                                </Button>
                            </div>
                            <div className="center-header-add-reward-container"> {type === "add" ? "Thêm Phần Thưởng" : "Cập Nhật Phần Thưởng"} </div>
                            <div className="right-header-add-reward-container"></div>
                        </div>
                    </Header>
                    <Content >
                        <Form onFinish={this.handleSubmit} size="large" className="form-add-reward">
                            <Form.Item className="form-item-add-reward">
                                <Input
                                    name="name" value={name} onChange={this.handleInputChange}
                                    className="name-reward-input" placeholder="Tên phần thưởng" type="text"
                                />
                            </Form.Item>
                            <Form.Item className="form-item-add-reward form-item-point-reward" >
                                <div className="point-reward-input-fake">
                                    <StarOutlined /> &nbsp; {points == 0 ? "Điểm thưởng" : `${points} Điểm`}
                                </div>
                                <Select 
                                    placeholder="Điểm thưởng"
                                    className="point-reward-input"
                                    onChange={(value) => this.setState({points: value})}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                <Input style={{ flex: 'auto' }} type="number" value={pointItem} onChange={this.handlePointItemChange} />
                                                <a
                                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                    onClick={this.addPointItem}
                                                >
                                                    <PlusOutlined /> Thêm
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {pointItems.map(item => <Option key={item}>{item} điểm</Option> )}
                                </Select>
                            </Form.Item>
                            <Form.Item className="form-item-add-reward">
                                <TeamOutlined
                                    className="icon-input-add-event"
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black", marginTop: 20 }}
                                />
                                <span
                                    className="title-input-add-event"
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black" }}
                                > Thành Viên: </span>
                                <Row align="middle" justify="center" style={{ marginBottom: 20 }}>
                                    {gettingListMembers && !gotListMembers ?
                                        <Spin tip="Loading..." />
                                        :
                                        <>
                                            {listMembers && listMembers.length > 5 &&
                                                <div onClick={this.handleClickPre} className="pre-icon-add-event"> <LeftOutlined /> </div>
                                            }
                                            <div ref={this.scrollBar} className="list-users-asign-add-event-container" >
                                                {renderListMembers()}
                                            </div>
                                            {listMembers && listMembers.length > 5 &&
                                                <div onClick={this.handleClickNext} className="next-icon-add-event"> <RightOutlined /> </div>
                                            }
                                        </>
                                    }
                                </Row>
                            </Form.Item>

                            <Form.Item className="form-item-add-reward">
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event" >
                                        <PictureOutlined
                                            className="icon-input-add-event"
                                            style={{ color: currentUrlImg !== "" ? "#096dd9" : "black" }}
                                        />
                                        <span style={{ color: currentUrlImg !== "" ? "#096dd9" : "black" }}> Hình ảnh </span>
                                    </Col>
                                    <Col span={16} className="col-form-item-add-event" >
                                        {currentUrlImg !== "" && <img src={currentUrlImg} style={{ width: 300, height: 'auto' }} />}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div className="upload-img-add-calendar-container" style={{ marginTop: currentUrlImg ? 5 : 0 }}>
                                                <div className="upload-img-ui-add-canlendar" >
                                                    <UploadOutlined style={{ fontSize: 16 }} />
                                                    &emsp;
                                                    <span style={{ fontSize: 16 }}> {!currentUrlImg ? "Chọn ảnh" : "Thay đổi ảnh"} </span>
                                                </div>
                                                <input ref={this.inputFile} className="input-file-add-calendar" type="file" onChange={this.handleChangeImg} />
                                            </div>
                                            {currentUrlImg && <div className="delete-img-button" onClick={this.handleClickDeleteImg}>Xóa ảnh</div>}
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-reward">
                                <Row className="row-form-item-add-event">
                                    <div className="title-input-add-event">
                                        <SnippetsOutlined
                                            className="icon-input-add-event"
                                            style={{ color: notes ? "#096dd9" : "black" }}
                                        />
                                        <span style={{ color: notes ? "#096dd9" : "black" }}>Ghi chú</span>
                                    </div>
                                    <TextArea
                                        name="notes" value={notes} onChange={this.handleInputChange}
                                        style={{ margin: "5px 20px 0px 20px" }} autoSize={{ minRows: 2 }}
                                    />
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-reward">
                                <Row className="row-form-item-add-event" style={{ float: "right", marginRight: 20 }}>
                                    {type === "add" ?
                                        <Button type="primary" ghost size="large"> Hủy </Button>
                                        :
                                        <Button onClick={this.handleDeleteReward} type="primary" ghost size="large"> Xóa </Button>
                                    }
                                &emsp;
                                <Button htmlType="submit" type="primary" size="large"> {type === "add" ? "Thêm" : "Cập nhật"} </Button>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Content>
                    <Footer style={{ textAlign: 'center', padding: "10px 0px", margin: "0px 20px" }}></Footer>
                </Layout>
            </Layout>
        );
    }
}

const actionCreators = {
    errorAlert: alertActions.error,
    getListMembers: familyActions.getListMembers,
}

const mapStateToProps = (state) => ({
    listMembers: state.family.listMembers,
    gettingListMembers: state.family.gettingListMembers,
    gotListMembers: state.family.gotListMembers,
})

export default connect(mapStateToProps, actionCreators)(AddReward);