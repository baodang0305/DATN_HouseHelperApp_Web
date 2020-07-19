import React, { Component } from 'react';
import './GroceryType.css';
import { Layout, Avatar, Row, Col, Input, Button, Modal, Tooltip, Spin, List } from "antd";
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL';

import { PlusOutlined, InfoCircleOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import HeaderMain from '../Common/HeaderMain/HeaderMain';
import { groceryTypeActions } from "../../actions/grocery.type.actions";

import history from '../../helpers/history';
import { groceryActions } from '../../actions/grocery.actions';

const { Search } = Input;
const { Header, Content, Footer } = Layout;
let socket;
class GroceryType extends Component {
    state = {
        visibleFormDeleteGroceryType: false,
        numberTasks: [],
        recentItem: null,
        idChosenReplace: null,
        hasChange: false,
        idClickedItem: null,
        dataMain: null, isChanged: false
    };

    getData = () => {
        const { getAllGroceryTypes, getAllGroceries } = this.props;
        getAllGroceryTypes();
        getAllGroceries();
    }


    componentDidMount() {
        const { hasChange } = this.state;
        this.getData();
        hasChange ? getAllGroceryTypes() : null;

        socket = socketIOClient(apiUrlTypes.heroku);
        socket.on("connect", () => {
            const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
            socket.emit("authenticate", { "token": inforLogin.token });
        });
        socket.on("authenticate", (res) => {
            console.log(res.message);
        });

        socket.on("ShoppingType", data => {
            // data={type:"addShoppingList"}
            switch (data.type) {
                case 'addShoppingType': {
                    this.getData();
                    break;
                }
                case 'editShoppingType': {
                    this.getData();
                    break;
                }
                case 'deleteShoppingType': {
                    this.getData();
                    break;
                }

                default:
                    break;
            }
        });

    }

    componentWillUnmount() {
        socket && socket.connected && socket.close();
    }
    handleChooseReplaceType = (idReplace) => {
        this.setState({ idChosenReplace: idReplace });
    }

    handleDeleteGroceryType = () => {
        const { deleteGroceryType } = this.props;
        const { recentItem, idChosenReplace } = this.state;
        deleteGroceryType(recentItem._id, idChosenReplace);
        this.setState({ visibleFormDeleteGroceryType: false, hasChange: true });
    }

    handleEditGroceryTypeAction = (chosenTypeToEdit) => {
        this.setState({ recentItem: chosenTypeToEdit });
        history.push({ pathname: '/grocery-type/edit-type', state: { chosenTypeToEdit } });
    }

    shouldComponentRender() {
        const { loadingGroceryType } = this.props;
        if (loadingGroceryType)
            return false
        return true
    }

    calculateNumberGroceryListEachType = (allGroceryTypes, allGroceries) => {
        let filteredResult = [];
        allGroceryTypes.forEach(element => {
            filteredResult.push({
                groceryType: element,
                statesEachType: [
                    {
                        stateGrocery: 'Cần mua',
                        color: '#2985ff',
                        numberLists: Number(allGroceries.filter(i => i.stID._id === element._id && i.listItems.some(itemInList => itemInList.isChecked === false)).length)
                    },
                    {
                        stateGrocery: 'Đã hoàn thành',
                        color: '#52c41a',
                        numberLists: Number(allGroceries.filter(i => i.stID._id === element._id && i.listItems.every(itemInList => itemInList.isChecked === true)).length)
                    },
                ]
            })
        });
        return filteredResult;
    }

    handleClickAItemInList = (idItem) => {
        const { idClickedItem } = this.state;
        if (idItem === idClickedItem) {
            this.setState({ idClickedItem: null })
        }
        else {
            this.setState({ idClickedItem: idItem })
        }
    }

    handleSearchData = (dataSearched) => {
        this.setState({ dataMain: dataSearched, isChanged: true })
    }

    render() {
        const { allGroceryTypes, allGroceries, user, } = this.props;
        const { visibleFormDeleteGroceryType, recentItem, idChosenReplace, idClickedItem, isChanged, dataMain } = this.state;
        let calculateNumberGroceryListEachType = dataMain ? dataMain : this.calculateNumberGroceryListEachType(allGroceryTypes, allGroceries);
        console.log('Du lieu', dataMain);

        return (
            <div>
                <Layout style={{ minHeight: '100vh', position: 'relative' }}>
                    <DashboardMenu menuItem="1" />
                    <Layout className="site-layout">
                        <Header className="header-container" >
                            <HeaderMain tab="groceryType"
                                tabData={this.calculateNumberGroceryListEachType(allGroceryTypes, allGroceries)}
                                title="Loại danh sách mua sắm"
                                handleSearchData={this.handleSearchData} />
                        </Header>

                        <Content className="grocery-type__content">
                            <div className="site-layout-background grocery-type__content-container">
                                {/* //filter by category */}
                                {this.shouldComponentRender()
                                    ? <div className="grocery-type__container">
                                        <div className="grocery-type__header-container">
                                            <div className="grocery-type__header-title">Danh sách loại công việc hiện tại</div>
                                            <div className="filter-grocery-type"></div>
                                        </div>
                                        <List className="grocery-type__list-container"
                                            pagination={{
                                                size: 'small',
                                                pageSize: 6
                                            }}
                                            size="large"
                                            dataSource={calculateNumberGroceryListEachType}
                                            renderItem={item =>
                                                <List.Item style={{ padding: '10px 0', position: 'relative' }}
                                                    key={item.groceryType._id}>
                                                    <div className="grocery-type__item-container" onClick={() => { this.handleClickAItemInList(item.groceryType._id) }}>
                                                        {/* //information of task category contain image and task category's name */}
                                                        <div className="grocery-type__infor-cate" >
                                                            <Avatar className="grocery-type__image-cate" src={item.groceryType.image} />
                                                            <div className="grocery-type__name-cate">
                                                                {item.groceryType.name}
                                                            </div>
                                                        </div>

                                                        {/* //information of task category contain number of task belong this one */}

                                                        {item.groceryType._id === idClickedItem ?
                                                            <div className="container-relative-infor-grocery-type" >
                                                                {item.statesEachType.map(i =>
                                                                    <div className="relative-infor-grocery-type">
                                                                        <div style={{ backgroundColor: i.color }} className="number-task-of-cate">{i.numberLists}</div>
                                                                        <div className="label-type-of-task">{i.stateGrocery}</div>
                                                                    </div>
                                                                )}
                                                            </div> : null}

                                                        {/* //some action to task category */}


                                                    </div>
                                                    <div className="grocery-type">
                                                        {item.groceryType._id === idClickedItem && user.mIsAdmin
                                                            ? (<div className="actions-grocery-type">
                                                                <div className="action-item-grocery-type" style={{ color: '#08979c' }} onClick={() => this.handleEditGroceryTypeAction(item.groceryType)} >
                                                                    <EditOutlined className="icon-action-grocery-type" />
                                                                    <div className="grocery-type__title-action">Sửa</div>
                                                                </div>
                                                                <div className="action-item-grocery-type" style={{ color: '#f5222d' }} onClick={(e) => this.setState({ visibleFormDeleteGroceryType: true, recentItem: item.groceryType })}>
                                                                    <DeleteOutlined className="icon-action-grocery-type" />
                                                                    <div className="grocery-type__title-action">Xóa</div>
                                                                </div>
                                                            </div>)
                                                            : null}
                                                    </div>
                                                </List.Item>}
                                        />

                                    </div>
                                    : <div className="spin-get-list-members loading-data"><Spin tip="Đang tải..." /> </div>}
                            </div>

                            {/* Form delete task category */}
                            <Modal
                                visible={visibleFormDeleteGroceryType}
                                footer={null}
                                maskClosable={false}
                                onCancel={(e) => this.setState({ visibleFormDeleteGroceryType: false })}>
                                <div className="container-form-delete-grocery-type">
                                    {recentItem ? <div className="show-recent-grocery-type">
                                        <div className="label-form-delete-grocery-type">Loại công việc hiện tại muốn xóa:</div>
                                        <Avatar src={recentItem.image} />
                                        <div>{recentItem.name}</div>
                                    </div> : null}
                                    <div className="show-grocery-type-replace">
                                        <div className="label-form-delete-grocery-type">
                                            <div>Chọn loại công việc thay thế:</div>

                                            <Tooltip placement="top" title="Các công việc của loại muốn xóa sẽ chuyển sang loại công việc thay thế">
                                                <InfoCircleOutlined style={{ fontSize: 18, marginLeft: 10 }} />
                                            </Tooltip>

                                        </div>
                                        <Row style={{ width: '100%' }} justify="center" gutter={[10, 10]}>
                                            {recentItem ? allGroceryTypes.map(item => {
                                                return item._id === recentItem._id
                                                    ? null
                                                    : <Col span={6} className="item-cate-replace-delete" key={item._id}>
                                                        <div className="container-item-cate-replace-delete"
                                                            onClick={() => this.handleChooseReplaceType(item._id)}>
                                                            <div className="container-image-item-cate-replace-delete">
                                                                <Avatar className={item._id === idChosenReplace ? "checked-grocery-type" : "image-item-cate-replace-delete"} src={item.image} />
                                                                {item._id === idChosenReplace ? <CheckCircleOutlined className="assignment-checked" /> : null}
                                                            </div>
                                                            <div>{item.name}</div>
                                                        </div>
                                                    </Col>
                                            }) : null}
                                        </Row>
                                    </div>
                                    <div className="btn-submit">
                                        <Button type="default" onClick={() => this.setState({ visibleFormDeleteGroceryType: false })}>Hủy bỏ</Button>
                                        <Button type="danger"
                                            onClick={() => this.handleDeleteGroceryType()}
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
    allGroceryTypes: state.groceryType.allGroceryTypes,
    allGroceries: state.grocery.allGroceries,
    loadingGroceryType: state.groceryType.loadingGroceryType
})

const actionCreators = {
    getAllGroceries: groceryActions.getAllGroceries,
    getAllGroceryTypes: groceryTypeActions.getAllGroceryTypes,
    deleteGroceryType: groceryTypeActions.deleteGroceryType,
}
export default connect(mapStateToProps, actionCreators)(GroceryType);