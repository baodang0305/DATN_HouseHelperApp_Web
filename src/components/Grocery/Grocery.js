import React from "react";
import './Grocery.css';
import { Link } from "react-router-dom";
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover, Spin, List, Tooltip } from "antd";
import { connect } from 'react-redux';
import { RedoOutlined, ExclamationCircleOutlined, LoadingOutlined, CloseOutlined, FieldTimeOutlined, CaretRightOutlined, BellOutlined, SolutionOutlined, MoreOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';

import { familyActions } from "../../actions/family.actions";
import { groceryActions } from "../../actions/grocery.actions";
import { groceryTypeActions } from "../../actions/grocery.type.actions";
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL';
import HeaderMain from "../Common/HeaderMain/HeaderMain";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import GroceryList from "./GroceryList/GroceryList";
import FilterMain from "../Common/FilterMain/FilterMain";
import { value } from "numeral";
const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Option } = Select;
let socket;

class Grocery extends React.Component {
    state = {
        allGroceriesState: null,
        quickFilter: { mem: 'all', time: 'newest', bill: 'none' },
        tabMode: 'todo',
        visiblePopover: false
    }

    getData() {
        const { getListMembers, listMembers, getAllGroceries, allGroceries, getAllGroceryTypes } = this.props;
        getListMembers();
        getAllGroceries();
        getAllGroceryTypes();

    }

    hidePopover = () => {
        this.setState({ visiblePopover: false });
    }

    componentDidMount() {
        this.getData();
        socket = socketIOClient(apiUrlTypes.heroku);
        socket.on("connect", () => {
            const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
            socket.emit("authenticate", { "token": inforLogin.token });
        });
        socket.on("authenticate", (res) => {
            console.log(res.message);
        });

        socket.on("ShoppingList", data => {
            // data={type:"addShoppingList"}
            switch (data.type) {
                case 'addShoppingList': {
                    this.getData();
                    break;
                }
                case 'editShoppingList': {
                    this.getData();
                    break;
                }
                case 'deleteShoppingList': {
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
    shouldComponentRender() {
        const { loadingMember, loadingGrocery } = this.props;
        if (loadingMember || loadingGrocery)
            return false
        return true
    }

    checkIsListComplete = (listShopping) => {
        var isCompletedList = false;
        if (listShopping.length > 0) {
            if (listShopping.every(itemInList => itemInList.isChecked === true)) {
                isCompletedList = true;
            }
        }
        return isCompletedList;
    }

    handleSelectFilter = (filter) => {
        const { allGroceries } = this.props;

        if (filter !== 'all') {
            if (allGroceries) {
                var tempGroceryFilter = allGroceries.filter(itemGrocery => {
                    var result = false;
                    if (itemGrocery.stID && itemGrocery.stID._id === filter) {
                        result = true;
                    }
                    else if (itemGrocery.assign) {
                        if (itemGrocery.assign._id === filter) {
                            result = true;
                        }
                    }
                    return result;
                })
                this.setState({ allGroceriesState: tempGroceryFilter });
            }
        } else {
            this.setState({ allGroceriesState: allGroceries });
        }

    }


    handleOnChangeTabMode = (activeKey) => {
        this.setState({ tabMode: activeKey });
    }

    onChangeSelectMember = (value) => {
        const { quickFilter } = this.state;
        const { user, allGroceries } = this.props;
        if (value === 'all') {
            this.setState({ quickFilter: { ...quickFilter, mem: value }, allGroceriesState: allGroceries });
        } else if (value === 'recentUser') {
            this.setState({ quickFilter: { ...quickFilter, mem: value }, allGroceriesState: allGroceries.filter(item => item.assign && item.assign._id === user._id) })
        }
    }

    handleVisiblePopoverChange = visiblePopover => {
        this.setState({ visiblePopover });
    };

    handleSearchData = (data) => {
        this.setState({ allGroceriesState: data })
    }

    onChangeSelectTime = (value) => {
        const { quickFilter, allGroceriesState } = this.state;
        const { user, allGroceries } = this.props;
        var tempData = allGroceriesState || allGroceries;
        var changedData = tempData.reverse();
        if (value === 'oldest') {
            this.setState({ quickFilter: { ...quickFilter, time: value }, allGroceriesState: tempData });
        } else if (value === 'newest') {
            this.setState({ quickFilter: { ...quickFilter, time: value }, allGroceriesState: changedData })
        }
    }
    render() {
        const { listMembers, allGroceryTypes, allGroceries, user } = this.props;
        const { allGroceriesState, quickFilter, tabMode, visiblePopover } = this.state;

        let dataGroceries = allGroceriesState ? allGroceriesState : allGroceries;


        return (
            <Layout style={{
                minHeight: '100vh'
            }} >
                <DashboardMenu menuItem="5" />
                <Layout className="site-layout">
                    <Header className="header-container">
                        <HeaderMain handleSearchData={this.handleSearchData}
                            tab="grocery" title="Mua sắm" tabData={allGroceries}>
                        </HeaderMain>
                    </Header>
                    <Content className="grocery__content">
                        <div className="grocery__content-container">
                            {/* filter by member or more */}
                            {this.shouldComponentRender()
                                ? <div>
                                    <div className="grocery__filter">
                                        <FilterMain tab='shoppingList' allMembers={listMembers} allCates={allGroceryTypes} handleSelectFilter={this.handleSelectFilter} />
                                    </div>

                                    <div className="grocery__main-data" style={{ marginTop: '-10px' }}>
                                        <Tabs defaultActiveKey="1" className="grocery__tab-data" onChange={this.handleOnChangeTabMode}
                                            tabBarExtraContent={
                                                <div className="quick-filter">

                                                    <div className="quick-filter__tablet-pc">
                                                        <Select onChange={this.onChangeSelectMember} defaultValue="all" allowClear className="quick-filter__item" placeholder="Thành viên">
                                                            <Option value="all">Tất cả thành viên</Option>
                                                            <Option value="recentUser">Được giao</Option>
                                                        </Select>
                                                        <Select onChange={this.onChangeSelectTime} allowClear defaultValue="oldest" placeholder="Thời gian" className="quick-filter__item">
                                                            <Option value="newest">Mới nhất</Option>
                                                            <Option value="oldest">Cũ nhất</Option>
                                                        </Select>
                                                        {tabMode === 'todo' ? null : <Select allowClear placeholder="Lọc hóa đơn" className="quick-filter__item">
                                                            <Option value="increaseCost">Giá cao nhất</Option>
                                                            <Option value="increaseCost">Giá thấp nhất</Option>
                                                        </Select>}
                                                    </div>
                                                    <Popover trigger="click"
                                                        visible={visiblePopover} onVisibleChange={this.handleVisiblePopoverChange}
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
                                                            {tabMode === 'todo' ? null : <Select size="small" allowClear placeholder="Lọc hóa đơn" className="quick-filter__item">
                                                                <Option value="increaseCost">Giá cao nhất</Option>
                                                                <Option value="increaseCost">Giá thấp nhất</Option>
                                                            </Select>}
                                                            <Button size="small" type="primary" ghost className="quick-filter__item"
                                                                onClick={this.hidePopover} icon={<CloseOutlined />}></Button>
                                                        </div>
                                                        }>
                                                        <Button size="small" type="primary" ghost>Tùy chọn lọc</Button>
                                                    </Popover>
                                                </div>

                                            }>

                                            <TabPane tab="CẦN MUA" key="todo">
                                                {allGroceries
                                                    ? <GroceryList
                                                        allGroceries={dataGroceries.filter(itemGrocery => !this.checkIsListComplete(itemGrocery.listItems))} />
                                                    : null}
                                            </TabPane>

                                            <TabPane tab="ĐÃ XONG" key="completed">
                                                {allGroceries
                                                    ? <GroceryList
                                                        allGroceries={dataGroceries.filter(itemGrocery => this.checkIsListComplete(itemGrocery.listItems))} />
                                                    : null}
                                            </TabPane>

                                        </Tabs>
                                    </div>
                                </div>
                                : <div className="spin-get-list-members loading-data-grocery"><Spin tip="Đang tải..." /> </div>}
                        </div>
                    </Content>
                </Layout>
            </ Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.inforLogin.user,
    token: state.authentication.inforLogin.token,
    listMembers: state.family.listMembers,
    loadingMember: state.family.loading,
    allGroceries: state.grocery.allGroceries,
    loadingGrocery: state.grocery.loadingGrocery,
    allGroceryTypes: state.groceryType.allGroceryTypes
})
const actionCreators = {
    getListMembers: familyActions.getListMembers,
    getAllGroceries: groceryActions.getAllGroceries,
    deleteGrocery: groceryActions.deleteGrocery,
    getAllGroceryTypes: groceryTypeActions.getAllGroceryTypes,
    assignGrocery: groceryActions.assignGrocery
}
export default connect(mapStateToProps, actionCreators)(Grocery);