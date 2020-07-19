import React from "react";
import { connect } from "react-redux";
import {
    LeftOutlined, PlusOutlined, StarOutlined, TeamOutlined, CheckOutlined, AppstoreAddOutlined
} from "@ant-design/icons";
import { Layout, Button, Input, Form, Select, Divider, Avatar, Spin, Alert, Row, Col } from "antd";

import "./AddReward.css";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from '../../../actions/family.actions';
import { alertActions } from "../../../actions/alert.actions";
import history from '../../../helpers/history';
import { rewardActions } from "../../../actions/reward.actions";
import Loading from "../../Common/Loading/Loading";

const { TextArea } = Input;
const { Option } = Select;
const { Header, Content, Footer } = Layout;

class AddReward extends React.Component {

    constructor(props) {
        super(props);

        const { type } = this.props;
        if (type === "edit") {
            const { reward } = history.location.state;
            let assign = [];
            reward && reward.assign && reward.assign.forEach(element => {
                assign.push(element._id);
            });
            this.state = {
                name: reward.name,
                assign: assign,
                points: reward.points,

                pointItem: '',
                quantity: reward.quantity || 0,
                quantityItem: 0,
                currentUrlImg: reward.photo,
                isErrorForm: false,
                pointItems: [5, 10, 15, 20],
                quantityItems: [1, 2, 3, 4, 5]
            }
        } else {
            this.state = {
                name: "",
                assign: [],
                points: 0,
                pointItem: '',
                quantity: 0,
                quantityItem: 0,
                currentUrlImg: "",
                isErrorForm: false,
                pointItems: [5, 10, 15, 20],
                quantityItems: [1, 2, 3, 4, 5]
            }
        }
        this.inputFile = React.createRef();
    }

    componentDidMount() {
        const { getListMembers } = this.props;
        getListMembers();

    }

    handleClickBack = () => {
        history.push("/rewards");
    }

    compareTwoArray = (newAssigns, currentAssigns) => {
        if (newAssigns.length === 0 && !currentAssigns) {
            return true;
        }
        else if (
            (newAssigns.length > 0 && !currentAssigns)
            ||
            (newAssigns.length !== currentAssigns.length)
        ) { return false; }
        else {
            for (let i = 0; i < newAssigns.length; i++) {
                let check = false;
                for (let j = 0; j < currentAssigns.length; j++) {
                    if (newAssigns[i] === currentAssigns[j]._id) {
                        check = true;
                        break;
                    }
                }
                if (!check) return false;
                else continue;
            }
            return true;
        }
    }

    handleSubmit = () => {

        const { type, editReward, addReward, errorAlert } = this.props;
        const { name, points, assign, quantity } = this.state;

        if (!name || name.replace(/\s/g, '').length === 0 || points < 1 || points > 100) {
            this.setState({ isErrorForm: true });
        } else {

            let rID = "";
            if (type === "edit") {
                const { reward } = history.location.state;
                if (
                    name === reward.name &&
                    points === reward.points &&
                    this.compareTwoArray(assign, reward.assign)
                ) return errorAlert("Không có thay đổi gì so với hiện tại")
                rID = reward._id;
            }

            type === "add"
                ? addReward({ name, points, assign })
                : editReward({ rID, name, points, assign })
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleAssign = (member) => {
        let { assign } = this.state;
        const indexMember = assign.findIndex(item => item === member._id);
        indexMember !== -1
            ? assign.splice(indexMember, 1)
            : assign = [...assign, member._id]
        this.setState({ assign });
    }

    handlePointItemChange = (e) => {
        this.setState({ pointItem: e.target.value });
    }

    handleQuantityItemChange = (e) => {
        this.setState({ quantityItem: e.target.value });
    }

    addPointItem = () => {
        let { pointItem, pointItems } = this.state;
        const { errorAlert } = this.props;
        if (pointItem && pointItem != 0) {
            const indexItem = pointItems.findIndex(item => item == pointItem);
            indexItem !== -1
                ? errorAlert("Điểm đã tồn tại")
                : (pointItems = [...pointItems, Number(pointItem)], this.setState({ pointItems }))
        }
        else {
            errorAlert("Điểm không hợp lệ")
        }
    }

    addQuantityItem = () => {
        let { quantityItem, quantityItems } = this.state;
        const { errorAlert } = this.props;
        if (quantityItem && quantityItem != 0) {
            const indexItem = quantityItems.findIndex(item => item == quantityItem);
            indexItem !== -1
                ? errorAlert("Số lượng đã tồn tại")
                : (quantityItems = [...quantityItems, Number(quantityItem)], this.setState({ quantityItems }))
        }
        else {
            errorAlert("Số lượng không hợp lệ")
        }
    }

    handleDeleteReward = () => {
        const { deleteReward } = this.props;
        const { reward } = history.location.state;
        deleteReward({ rID: reward._id });
    }

    render() {

        const {
            type, gettingListMembers, gotListMembers, listMembers,
            addingReward, addedReward, editingReward, editedReward,
            deletingReward, deletedReward,
        } = this.props;
        const {
            name, pointItems, assign, points, pointItem, isErrorForm, quantity, quantityItem, quantityItems
        } = this.state;

        const isSelectedMember = (mID) => assign && assign.findIndex(item => item === mID)

        const renderListMembers = () => (
            listMembers && listMembers.map((item, index) => (
                <div className="user-add-reward-container" key={index} onClick={() => this.handleAssign(item)}>
                    <div className="avatar-add-reward-container">
                        <Avatar
                            className="avatar-add-reward"
                            style={{ backgroundColor: item.mAvatar.color, opacity: isSelectedMember(item._id) !== -1 && 0.5 }}
                            src={item.mAvatar.image}
                        />
                        {isSelectedMember(item._id) !== -1 && <CheckOutlined className="check-asign-add-reward" />}
                    </div>
                    <div className="name-user-add-reward">{item.mName}</div>
                </div>
            ))
        )

        // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
        // const renderSpin = () => (
        //     <div className="icon-loading-add-reward">
        //         <Spin style={{ color: 'white' }} size="large" indicator={antIcon} />
        //     </div>
        // )

        return (
            <Layout style={{ minHeight: '100vh', position: 'relative' }}>
                <DashboardMenu menuItem="4" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <div className="left-header-add-reward-container">
                            <div onClick={this.handleClickBack} className="header__btn-link">
                                <LeftOutlined className="header__icon-btn" />
                            </div>
                        </div>
                        <div className="center-header-add-reward-container"> {type === "add" ? "Thêm Phần Thưởng" : "Cập Nhật Phần Thưởng"} </div>
                        <div className="right-header-add-reward-container"></div>
                    </Header>
                    <Content>
                        {isErrorForm && (!name || name.replace(/\s/g, '').length === 0 || points < 1 || points > 100) &&
                            <Alert message={`
                                ${(!name || name.replace(/\s/g, '').length === 0) ? "Ten" : ""}
                                ${(points < 1 || points > 100) ? "Diem" : ""}  
                                là bắt buộc.
                            `} type="error" style={{ margin: '10px 20px' }} />
                        }
                        <Form onFinish={this.handleSubmit} size="large" className="form-add-reward">
                            <Form.Item className="form-item-add-reward form-item-input-name">
                                <Input
                                    name="name" value={name} onChange={this.handleInputChange}
                                    className="name-input-add-reward" placeholder="Tên phần thưởng" type="text"
                                />
                            </Form.Item>
                            <Form.Item className="form-item-point-reward" >
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div style={{ position: 'relative', flexBasis: '100%', boxSizing: 'border-box' }}>
                                        <div className="point-input-fake-add-reward">
                                            <StarOutlined /> &nbsp; {points == 0 ? "Điểm thưởng" : `${points} Điểm`}
                                        </div>
                                        <Select
                                            placeholder="Điểm thưởng"
                                            className="point-input-add-reward"
                                            onChange={(value) => this.setState({ points: value })}
                                            dropdownRender={menu => (
                                                <div>
                                                    {menu}
                                                    <Divider />
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
                                            {pointItems.map(item => <Option key={item}>{item} điểm</Option>)}
                                        </Select>
                                    </div>

                                </div>
                            </Form.Item>
                            <Form.Item className="form-item-add-reward">
                                <TeamOutlined
                                    className="icon-input-add-reward"
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black" }}
                                />
                                <span
                                    className="title-input-add-reward"
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black" }}
                                > Thành Viên: </span>
                                <div style={{ display: 'flex' }}>
                                    <div className="list-users-asign-add-reward-container" >
                                        {(gettingListMembers && !gotListMembers)
                                            ? <Spin style={{ margin: 'auto' }} tip="Loading..." />
                                            : renderListMembers()
                                        }
                                    </div>
                                </div>

                            </Form.Item>
                            <Form.Item className="form-item-add-reward">
                                <div className="button-container-add-reward">
                                    {type === "add"
                                        ? <Button type="primary" ghost size="large"> Hủy </Button>
                                        : <Button onClick={this.handleDeleteReward} type="primary" ghost size="large"> Xóa </Button>
                                    }
                                    &emsp;
                                    <Button htmlType="submit" type="primary" size="large"> {type === "add" ? "Thêm" : "Cập nhật"} </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Content>
                </Layout>
                {(
                    (addingReward && !addedReward) ||
                    (editingReward && !editedReward) ||
                    (deletingReward && !deletedReward)
                ) && <Loading />}
            </Layout >
        );
    }
}

const actionCreators = {
    errorAlert: alertActions.error,
    getListMembers: familyActions.getListMembers,
    addReward: rewardActions.addReward,
    editReward: rewardActions.editReward,
    deleteReward: rewardActions.deleteReward,
}

const mapStateToProps = (state) => ({
    listMembers: state.family.listMembers,
    gettingListMembers: state.family.gettingListMembers,
    gotListMembers: state.family.gotListMembers,
    addingReward: state.reward.addingReward,
    addedReward: state.reward.addedReward,
    editingReward: state.reward.editingReward,
    editedReward: state.reward.editedReward,
    deletingReward: state.reward.deletingReward,
    deletedReward: state.reward.deletedReward,
})

export default connect(mapStateToProps, actionCreators)(AddReward);