import React, { Component } from 'react';
import {
    Layout,
    Avatar,
    Row,
    Col,
    Input,
    Button,
    Tabs,
    Collapse,
    Modal,
    Select,
    Popover,
    Spin
} from 'antd';
import {
    PlusOutlined,
    HomeOutlined,
    CaretRightOutlined,
    BellOutlined, SearchOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const { Search } = Input;
class HeaderMain extends Component {
    state = {
        enableInputSearch: false
    }
    render() {
        const { enableInputSearch } = this.state;
        const { user, tab, title } = this.props;
        return (
            <div className="task__header-container">
                <div className="header-part-left">
                    <Link to="/family" style={{ marginRight: 10 }} className="header__btn-link">
                        <HomeOutlined className="task__header-icon" />
                    </Link>
                    <Search
                        className={enableInputSearch ? "header__search-task-input" : "header__unable-input-search"}
                        placeholder="Nhập nội dung tìm kiếm"
                        onSearch={value => console.log(value)}
                        style={{ width: 'max-content' }}
                        size="large"
                        suffix={<div style={{ width: '30px', height: '100%', position: 'absolute', zIndex: '999' }}
                            onClick={() => { this.setState({ enableInputSearch: !enableInputSearch }) }} />}
                    />
                    <div className="header__btn-link" style={{ display: enableInputSearch ? 'none' : null }}
                        onClick={() => { this.setState({ enableInputSearch: !enableInputSearch }) }}>
                        <SearchOutlined className="task__header-icon" />
                    </div>
                </div>
                <div className="header-title">
                    {title}
                </div>
                <div className="header-part-right">
                    <div style={{ marginRight: 10 }} className="header__btn-link">
                        <BellOutlined className="task__header-icon" />
                    </div>
                    {user.mIsAdmin === true ? (
                        tab === 'task' ? (
                            <Link to="/tasks/add-task" className="header__btn-link">
                                <PlusOutlined className="task__header-icon" />
                            </Link>
                        ) : tab === 'taskCategory' ? (
                            <Link to="/add-task-category" className="header__btn-link">
                                <PlusOutlined className="task__header-icon" />
                            </Link>

                        ) : tab === 'reward' ? (
                            <Link to="/rewards/add-reward" className="header__btn-link">
                                <PlusOutlined className="task__header-icon" />
                            </Link>
                        ) : tab === 'grocery' ? <Link to="/groceries/add-grocery" className="header__btn-link">
                            <PlusOutlined className="task__header-icon" />
                        </Link> : null
                    ) : null}
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.authentication.inforLogin.user
});
export default connect(mapStateToProps, null)(HeaderMain);
