import React from "react";
import './Grocery.css';
import { Link } from "react-router-dom";
import { Layout, Avatar, Row, Col, Input, Button, Tabs, Collapse, Modal, Select, Popover, Spin, List, Divider, Tooltip } from "antd";
import { connect } from 'react-redux';
import { PlusOutlined, HomeOutlined, ProfileOutlined, FieldTimeOutlined, CaretRightOutlined, BellOutlined, SolutionOutlined, MoreOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';

import { familyActions } from "../../actions/family.actions";
import { groceryActions } from "../../actions/grocery.actions";
import socketIOClient from "socket.io-client";
import apiUrlTypes from '../../helpers/apiURL'
import HeaderMain from "../Common/HeaderMain/HeaderMain";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;
let socket;

class Grocery extends React.Component {
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

    render() {
        const { listMembers, allGroceries } = this.props;

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

                                    <div className="grocery__main-collapse">
                                        <Divider orientation="center" className="grocery__divider">Cần mua</Divider>
                                        <Collapse
                                            accordion
                                            bordered={false}
                                            defaultActiveKey={['1']}
                                            expandIconPosition="left"
                                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                            className="site-collapse-custom-collapse"
                                        >
                                            {allGroceries
                                                ? allGroceries.map(itemGrocery => <Panel header={
                                                    <div className="grocery__header-container">
                                                        <div className="grocery__des-list">
                                                            <div className="grocery__title-list">{itemGrocery.name}</div>
                                                            <span>&nbsp;-&nbsp;</span>
                                                            <div className="grocery__number-item">{itemGrocery.listItems.length}</div>
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

                                                            <div className="grocery__option-actions grocery__actions-list" onClick={(e) => { alert('Click ed') }}>
                                                                <MoreOutlined className="grocery__icon-action-option"></MoreOutlined>
                                                                <div className="grocery__action">
                                                                    <PaperClipOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action">Ghim</div>
                                                                </div>
                                                                <div className="grocery__action" style={{ color: '#d4b106' }}>
                                                                    <FieldTimeOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action">Dời hạn</div>
                                                                </div>
                                                                <div className="grocery__action" style={{ color: '#13c2c2' }}>
                                                                    <EditOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action" >Sửa</div>
                                                                </div>
                                                                <div className="grocery__action" style={{ color: '#EC6764' }}>
                                                                    <DeleteOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action">Xóa</div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                    </div>
                                                }
                                                    key={itemGrocery._id}
                                                    className="site-collapse-custom-panel grocery__panel">
                                                    <div className="grocery__list-item-container">
                                                        <List
                                                            dataSource={itemGrocery.listItems}
                                                            renderItem={item =>
                                                                <List.Item className="grocery__item-container">
                                                                    <div className="grocery__quick-check-container">
                                                                        <div className="grocery__quick-check">
                                                                            <input checked={item.isChecked ? true : false}
                                                                                onChange={(e) => this.checkCompleteByCheckBox(item)}
                                                                                type="checkbox" key={item.name} id={`${item.name}`} className="check-box-task" />
                                                                            <label htmlFor={`${item.name}`}></label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grocery__info-item">
                                                                        <div className="grocery__des-info-item">
                                                                            <div className="grocery__name-item">{item.name}</div>
                                                                            <div className="grocery__note-item">{item.details}</div>
                                                                        </div>
                                                                        <div className="grocery__image-item"></div>

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
                                                                    </div>

                                                                </List.Item>

                                                            } />
                                                    </div>
                                                </Panel>)
                                                : null}
                                        </Collapse>

                                        <Divider orientation="center" className="grocery__divider">Đã hoàn tất</Divider>
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
})
const actionCreators = {
    getListMembers: familyActions.getListMembers,
    getAllGroceries: groceryActions.getAllGroceries,
}
export default connect(mapStateToProps, actionCreators)(Grocery);