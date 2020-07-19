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
    Spin, Tooltip
} from 'antd';
import {
    PlusOutlined,
    HomeOutlined,
    CaretRightOutlined,
    BellOutlined, SearchOutlined, ArrowLeftOutlined, LeftOutlined, CloseOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { value } from 'numeral';

const { Search } = Input;


function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}
class HeaderMain extends Component {
    state = {
        enableInputSearch: false,
        dataFilter: null,
        visiblePopover: false
    }

    getKeyMainTabAddLink(tab) {

        let linkAddBtn = '';
        switch (tab) {
            case 'task':
                {
                    linkAddBtn = "/tasks/add-task";
                    break;
                }
            case 'taskCategory':
                {
                    linkAddBtn = "/add-task-category";
                    break;
                }
            case 'reward':
                {
                    linkAddBtn = "/rewards/add-reward";
                    break;
                }
            case 'grocery':
                {
                    linkAddBtn = "/groceries/add-grocery";
                    break;
                }
            case 'calendar':
                {
                    linkAddBtn = "/calendar/add-event";
                    break;
                }
            case 'groceryType':
                {
                    linkAddBtn = "/grocery-type/add-type";
                }
            default: break;
        }
        return linkAddBtn;
    }

    onSearch = (value) => {
        const { tabData, handleSearchData, tab } = this.props;

        if (value) {
            if (tab === 'groceryType') {
                var dataFilter = tabData.filter(item => nonAccentVietnamese(item.groceryType.name).indexOf(nonAccentVietnamese(value)) !== -1)
                handleSearchData(dataFilter);
            }
            else if (tab === 'taskCategory') {
                var dataFilter = tabData.filter(item => nonAccentVietnamese(item.taskCategory.name).indexOf(nonAccentVietnamese(value)) !== -1)
                handleSearchData(dataFilter);
            }
            else {
                var dataFilter = tabData.filter(item => nonAccentVietnamese(item.name).indexOf(nonAccentVietnamese(value)) !== -1)
                handleSearchData(dataFilter);
            }
        } else handleSearchData(tabData);
    }

    hidePopover = () => {
        this.setState({
            visiblePopover: false,
        });
    };

    handleVisibleChangePopover = visiblePopover => {
        this.setState({ visiblePopover });
    };
    render() {
        const { enableInputSearch, dataFilter, visiblePopover } = this.state;
        const { user, tab, title, tabData } = this.props;

        return (
            <div className="task__header-container">
                <div className="header-part-left">
                    {tab === 'taskCategory'
                        ?
                        <Tooltip title='Trang gia đình' placement='bottomLeft'>
                            <Link to="/family/setting" style={{ marginRight: 10 }} className="header__btn-link">
                                <LeftOutlined className="task__header-icon" />
                            </Link>
                        </Tooltip> :
                        tab === 'groceryType'
                            ?
                            <Tooltip placement='bottomLeft' title='Trang gia đình'>
                                <Link to="/family/setting" style={{ marginRight: 10 }} className="header__btn-link">
                                    <LeftOutlined className="task__header-icon" />
                                </Link>
                            </Tooltip>
                            : <Tooltip placement='bottomLeft' title='Trang gia đình'>
                                <Link to="/family" style={{ marginRight: 10 }} className="header__btn-link">
                                    <HomeOutlined className="task__header-icon" />
                                </Link>
                            </Tooltip>
                    }


                    <Search className="header-search__tablet-pc"
                        prefix={
                            <Tooltip placement="bottom" title="Đóng tìm kiếm">
                                <CloseOutlined onClick={() => this.setState({ enableInputSearch: !enableInputSearch })} />
                            </Tooltip>}
                        allowClear
                        placeholder="Nhập từ khóa"
                        onSearch={this.onSearch}
                        style={{
                            maxWidth: 200,
                            overflowX: 'hidden',
                            display: enableInputSearch ? 'flex' : 'none'
                        }}
                    />
                    <Popover className="header-search__mobile header__btn-link"
                        content={
                            <Search
                                allowClear
                                prefix={
                                    <CloseOutlined onClick={this.hidePopover} />}
                                placeholder="Nhập từ khóa"
                                onSearch={this.onSearch}
                                style={{
                                    maxWidth: 200,
                                    overflowX: 'hidden',
                                }}
                            />}
                        trigger="click"
                        visible={this.state.visiblePopover}
                        onVisibleChange={this.handleVisibleChangePopover}
                    >
                        <div className="header__btn-link header-search__tablet-pc" style={{ display: enableInputSearch ? 'none' : null }}
                        >
                            <SearchOutlined className="task__header-icon" />
                        </div>
                    </Popover>
                    <div className="header__btn-link header-search__tablet-pc" style={{ display: enableInputSearch ? 'none' : null }}
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
                    {user.mIsAdmin === true ?
                        <Tooltip title="Thêm" placement="bottomRight">
                            <Link to={this.getKeyMainTabAddLink(tab)} className="header__btn-link">
                                <PlusOutlined className="task__header-icon" />
                            </Link>
                        </Tooltip>
                        : null
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    user: state.authentication.inforLogin.user
});
export default connect(mapStateToProps, null)(HeaderMain);
