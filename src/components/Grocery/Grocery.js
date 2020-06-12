import React from "react";
import './Grocery.css';
import { Link } from "react-router-dom";
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover, Spin, List, Divider, Tooltip } from "antd";
import { connect } from 'react-redux';
import { RedoOutlined, ExclamationCircleOutlined, LoadingOutlined, ProfileOutlined, FieldTimeOutlined, CaretRightOutlined, BellOutlined, SolutionOutlined, MoreOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';

import { familyActions } from "../../actions/family.actions";
import { groceryActions } from "../../actions/grocery.actions";
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL'
import HeaderMain from "../Common/HeaderMain/HeaderMain";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;
const { confirm } = Modal;
let socket;

class Grocery extends React.Component {
    state = {
        isActing: false,
        isActive: false,
        idClickedGrocery: null,
        idCheckBoughtItemOfGrocery: null,
    }

    componentWillMount() {
        const { getListMembers, listMembers, getAllGroceries, allGroceries } = this.props;
        getListMembers();
        getAllGroceries();
    }

    shouldComponentRender() {
        const { loadingMember, loadingGrocery } = this.props;
        if (loadingMember || loadingGrocery)
            return false
        return true
    }

    handleDeleteGrocery = (slID) => {
        const { deleteGrocery } = this.props;
        deleteGrocery(slID);
    }

    showDeleteConfirm = (type, slID) => {
        const { deleteGrocery } = this.props;
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                if (type === 'delete') {
                    deleteGrocery(slID);
                }
            },
            onCancel: () => {
                this.setState({ isActing: false });
            },
        });
    }

    handleClickExpandGrocery = (idClickedGrocery) => {
        const { isActive } = this.state;
        this.setState({ isActive: !isActive, idClickedGrocery })
    }

    handleCheckBoughtItem = (slID, islID) => {
        const { checkBoughtItem } = this.props;
        checkBoughtItem(slID, islID);
        this.setState({ idCheckBoughtItemOfGrocery: islID });
    }

    checkIsListComplete = (listShopping) => {
        var isCompletedList = false;
        if (listShopping.every(itemInList => itemInList.isChecked === true)) {
            isCompletedList = true;
        }
        return isCompletedList;
    }

    render() {
        const { listMembers, allGroceries, loadingCheckBought } = this.props;
        const { isActing, isActive, idClickedGrocery, idCheckBoughtItemOfGrocery } = this.state;

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
                                    </div>
                                    <div className="grocery__main-data">
                                        <Divider orientation="center" className="grocery__divider">Cần mua</Divider>
                                        <List dataSource={allGroceries.filter(itemGrocery => !this.checkIsListComplete(itemGrocery.listItems))}
                                            renderItem={itemGrocery => (
                                                <div className="grocery__data-grocery">
                                                    <div className="grocery__header-container" >
                                                        <div className="grocery__des-list" onClick={() => this.handleClickExpandGrocery(itemGrocery._id)}>
                                                            <CaretRightOutlined style={{ marginRight: 10 }} rotate={isActive && itemGrocery._id === idClickedGrocery ? 90 : 0} />
                                                            <div className="grocery__title-list">{itemGrocery.name}</div>
                                                            <span>&nbsp;-&nbsp;</span>
                                                            {this.checkIsListComplete(itemGrocery.listItems)
                                                                ? <div className="grocery__number-item grocery__is-completed">{itemGrocery.listItems.length}</div>
                                                                : <div className="grocery__number-item ">{itemGrocery.listItems.length}</div>}

                                                        </div>

                                                        <div className="grocery__relative-info">
                                                            <div className="grocery__assign-member">
                                                                {itemGrocery.assign
                                                                    ? <Tooltip placement="bottom" title={itemGrocery.assign.mName}>
                                                                        <Avatar src={itemGrocery.assign.mAvatar.image}></Avatar>
                                                                    </Tooltip>
                                                                    : <div className="grocery__action">
                                                                        <SolutionOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Nhận ngay</div>
                                                                    </div>}
                                                            </div>

                                                            <div className="grocery__option-actions grocery__actions-list">

                                                                {/* <div className="grocery__action">
                                                                        <PaperClipOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Ghim</div>
                                                                    </div>
                                                                    <div className="grocery__action" style={{ color: '#d4b106' }}>
                                                                        <FieldTimeOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Dời hạn</div>
                                                                    </div> */}
                                                                {this.checkIsListComplete(itemGrocery.listItems)
                                                                    ? <div className="grocery__action" style={{ color: '#d4b106' }}>
                                                                        <RedoOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Tạo lại</div>
                                                                    </div>
                                                                    : <>
                                                                        <div className="grocery__action" style={{ color: '#13c2c2' }}>
                                                                            <EditOutlined className="grocery__icon-action" />
                                                                            <div className="grocery__title-action" >Sửa</div>
                                                                        </div>
                                                                        <div className="grocery__action" style={{ color: '#EC6764' }} onClick={() => {
                                                                            this.setState({ isActing: true });
                                                                            this.showDeleteConfirm('delete', itemGrocery._id)
                                                                        }}>
                                                                            <DeleteOutlined className="grocery__icon-action" />
                                                                            <div className="grocery__title-action">Xóa</div>
                                                                        </div>
                                                                    </>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isActive && itemGrocery._id === idClickedGrocery ?
                                                        <div className="grocery__list-item-container">
                                                            <List
                                                                dataSource={itemGrocery.listItems}
                                                                renderItem={item =>
                                                                    <List.Item className="grocery__item-container">
                                                                        <div className="grocery__quick-check-container">
                                                                            {loadingCheckBought && item._id === idCheckBoughtItemOfGrocery ?
                                                                                <LoadingOutlined style={{ fontSize: 28, color: '#2985ff' }} />
                                                                                : <div className="grocery__quick-check">
                                                                                    <input checked={item.isChecked ? true : false}
                                                                                        onChange={(e) => this.handleCheckBoughtItem(itemGrocery._id, item._id)}
                                                                                        type="checkbox" key={item.name} id={`${item.name}`} className="check-box-task" />
                                                                                    <label htmlFor={`${item.name}`}></label>
                                                                                </div>}

                                                                        </div>
                                                                        <div className="grocery__info-item">
                                                                            <div className="grocery__des-info-item">
                                                                                <div className="grocery__name-item">{item.name}</div>
                                                                                <div className="grocery__note-item">{item.details}</div>
                                                                            </div>
                                                                            <div className="grocery__image-item" style={{ height: '100%' }}>
                                                                                <img src={item.photo} style={{ height: '100%', objectFit: 'contain' }}></img>
                                                                            </div>
                                                                            {item.isChecked ? null :
                                                                                <div className="grocery__action-item">
                                                                                    <div className="grocery__action" style={{ color: '#13c2c2' }}>
                                                                                        <EditOutlined className="grocery__icon-action" />
                                                                                        <div className="grocery__title-action" >Sửa</div>
                                                                                    </div>
                                                                                    <div className="grocery__action" style={{ color: '#EC6764' }}>
                                                                                        <DeleteOutlined className="grocery__icon-action" />
                                                                                        <div className="grocery__title-action">Xóa</div>
                                                                                    </div>
                                                                                </div>
                                                                            }

                                                                        </div>

                                                                    </List.Item>
                                                                } />
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            )}
                                        />


                                    </div>
                                    <div className="grocery__main-data">
                                        <Divider orientation="center" className="grocery__divider">Đã hoàn thành</Divider>
                                        <List dataSource={allGroceries.filter(itemGrocery => this.checkIsListComplete(itemGrocery.listItems))}
                                            renderItem={itemGrocery => (
                                                <div className="grocery__data-grocery">
                                                    <div className="grocery__header-container" >
                                                        <div className="grocery__des-list" onClick={() => this.handleClickExpandGrocery(itemGrocery._id)}>
                                                            <CaretRightOutlined style={{ marginRight: 10 }} rotate={isActive && itemGrocery._id === idClickedGrocery ? 90 : 0} />
                                                            <div className="grocery__title-list">{itemGrocery.name}</div>
                                                            <span>&nbsp;-&nbsp;</span>
                                                            {this.checkIsListComplete(itemGrocery.listItems)
                                                                ? <div className="grocery__number-item grocery__is-completed">{itemGrocery.listItems.length}</div>
                                                                : <div className="grocery__number-item ">{itemGrocery.listItems.length}</div>}

                                                        </div>

                                                        <div className="grocery__relative-info">
                                                            <div className="grocery__assign-member">
                                                                {itemGrocery.assign
                                                                    ? <Tooltip placement="bottom" title={itemGrocery.assign.mName}>
                                                                        <Avatar src={itemGrocery.assign.mAvatar.image}></Avatar>
                                                                    </Tooltip>
                                                                    : <div className="grocery__action">
                                                                        <SolutionOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Nhận ngay</div>
                                                                    </div>}
                                                            </div>

                                                            <div className="grocery__option-actions grocery__actions-list">

                                                                {/* <div className="grocery__action">
                                                                        <PaperClipOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Ghim</div>
                                                                    </div>
                                                                    <div className="grocery__action" style={{ color: '#d4b106' }}>
                                                                        <FieldTimeOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Dời hạn</div>
                                                                    </div> */}
                                                                {this.checkIsListComplete(itemGrocery.listItems)
                                                                    ? <div className="grocery__action" style={{ color: '#d4b106' }}>
                                                                        <RedoOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Tạo lại</div>
                                                                    </div>
                                                                    : <>
                                                                        <div className="grocery__action" style={{ color: '#13c2c2' }}>
                                                                            <EditOutlined className="grocery__icon-action" />
                                                                            <div className="grocery__title-action" >Sửa</div>
                                                                        </div>
                                                                        <div className="grocery__action" style={{ color: '#EC6764' }} onClick={() => {
                                                                            this.setState({ isActing: true });
                                                                            this.showDeleteConfirm('delete', itemGrocery._id)
                                                                        }}>
                                                                            <DeleteOutlined className="grocery__icon-action" />
                                                                            <div className="grocery__title-action">Xóa</div>
                                                                        </div>
                                                                    </>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isActive && itemGrocery._id === idClickedGrocery ?
                                                        <div className="grocery__list-item-container">
                                                            <List
                                                                dataSource={itemGrocery.listItems}
                                                                renderItem={item =>
                                                                    <List.Item className="grocery__item-container">
                                                                        <div className="grocery__quick-check-container">
                                                                            {loadingCheckBought && item._id === idCheckBoughtItemOfGrocery ?
                                                                                <LoadingOutlined style={{ fontSize: 28, color: '#2985ff' }} />
                                                                                : <div className="grocery__quick-check">
                                                                                    <input checked={item.isChecked ? true : false}
                                                                                        onChange={(e) => this.handleCheckBoughtItem(itemGrocery._id, item._id)}
                                                                                        type="checkbox" key={item.name} id={`${item.name}`} className="check-box-task" />
                                                                                    <label htmlFor={`${item.name}`}></label>
                                                                                </div>}

                                                                        </div>
                                                                        <div className="grocery__info-item">
                                                                            <div className="grocery__des-info-item">
                                                                                <div className="grocery__name-item">{item.name}</div>
                                                                                <div className="grocery__note-item">{item.details}</div>
                                                                            </div>
                                                                            <div className="grocery__image-item" style={{ height: '100%' }}>
                                                                                <img src={item.photo} style={{ height: '100%', objectFit: 'contain' }}></img>
                                                                            </div>
                                                                            {item.isChecked ? null :
                                                                                <div className="grocery__action-item">
                                                                                    <div className="grocery__action" style={{ color: '#13c2c2' }}>
                                                                                        <EditOutlined className="grocery__icon-action" />
                                                                                        <div className="grocery__title-action" >Sửa</div>
                                                                                    </div>
                                                                                    <div className="grocery__action" style={{ color: '#EC6764' }}>
                                                                                        <DeleteOutlined className="grocery__icon-action" />
                                                                                        <div className="grocery__title-action">Xóa</div>
                                                                                    </div>
                                                                                </div>
                                                                            }

                                                                        </div>

                                                                    </List.Item>
                                                                } />
                                                        </div>
                                                        : null
                                                    }
                                                </div>
                                            )}
                                        />


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
    loadingCheckBought: state.grocery.loadingCheckBought
})
const actionCreators = {
    getListMembers: familyActions.getListMembers,
    getAllGroceries: groceryActions.getAllGroceries,
    deleteGrocery: groceryActions.deleteGrocery,
    checkBoughtItem: groceryActions.checkBoughtItem
}
export default connect(mapStateToProps, actionCreators)(Grocery);