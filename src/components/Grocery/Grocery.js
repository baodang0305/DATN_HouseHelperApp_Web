import React from "react";
import './Grocery.css';
import { Link } from "react-router-dom";
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover, Spin, List, Divider, Tooltip } from "antd";
import { connect } from 'react-redux';
import { RedoOutlined, ExclamationCircleOutlined, LoadingOutlined, ProfileOutlined, FieldTimeOutlined, CaretRightOutlined, BellOutlined, SolutionOutlined, MoreOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';

import { familyActions } from "../../actions/family.actions";
import { groceryActions } from "../../actions/grocery.actions";
import { groceryTypeActions } from "../../actions/grocery.type.actions";
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL';
import HeaderMain from "../Common/HeaderMain/HeaderMain";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import GroceryList from "./GroceryList/GroceryList";
import FilterMain from "../Common/FilterMain/FilterMain";
const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;
const { confirm } = Modal;
const { TabPane } = Tabs;
let socket;

class Grocery extends React.Component {
    state = {
        allGroceriesState: null,
    }

    getData() {
        const { getListMembers, listMembers, getAllGroceries, allGroceries, getAllGroceryTypes } = this.props;
        getListMembers();
        getAllGroceries();
        getAllGroceryTypes();

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
                case 'checkBoughtShoppingList': {
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
        if (listShopping.every(itemInList => itemInList.isChecked === true)) {
            isCompletedList = true;
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



    render() {
        const { listMembers, allGroceryTypes, allGroceries, user } = this.props;
        const { allGroceriesState } = this.state;
        console.log(allGroceriesState);
        let dataGroceries = allGroceriesState ? allGroceriesState : allGroceries;
        console.log(dataGroceries);

        return (
            <Layout style={{
                minHeight: '100vh'
            }} >
                <DashboardMenu menuItem="5" />
                <Layout className="site-layout">
                    <Header className="header-container">
                        <HeaderMain tab="grocery" title="Mua sắm">
                        </HeaderMain>
                    </Header>
                    <Content className="grocery__content">
                        <div className="grocery__content-container">
                            {/* filter by member or more */}
                            {this.shouldComponentRender()
                                ? <div>
                                    <div className="grocery__filter">
                                        <FilterMain allMembers={listMembers} allCates={allGroceryTypes} handleSelectFilter={this.handleSelectFilter} />
                                    </div>
                                    {/* <div className="grocery__main-data">
                                        <Divider orientation="center" className="grocery__divider">Cần mua</Divider>
                                        <GroceryList allGroceries={allGroceries.filter(itemGrocery => !this.checkIsListComplete(itemGrocery.listItems))} />
                                    </div>
                                    <div className="grocery__main-data">
                                        <Divider orientation="center" className="grocery__divider">Đã hoàn thành</Divider>
                                        <GroceryList allGroceries={allGroceries.filter(itemGrocery => this.checkIsListComplete(itemGrocery.listItems))} />
                                    </div> */}

                                    <div className="grocery__main-data">
                                        <Tabs defaultActiveKey="1" className="grocery__tab-data">
                                            <TabPane tab="Danh sách cần mua" key="1">
                                                {allGroceries ? <GroceryList allGroceries={dataGroceries.filter(itemGrocery => !this.checkIsListComplete(itemGrocery.listItems))} /> : null}
                                            </TabPane>

                                            <TabPane tab="Danh sách đã hoàn tất" key="2">
                                                {allGroceries ? <GroceryList allGroceries={dataGroceries.filter(itemGrocery => this.checkIsListComplete(itemGrocery.listItems))} /> : null}
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