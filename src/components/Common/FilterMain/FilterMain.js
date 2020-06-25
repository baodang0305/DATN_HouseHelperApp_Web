import React, { Component } from 'react';
import { Avatar, Popover } from 'antd';

class FilterMain extends Component {
    state = {
        idChosenMember: 'all',
        idChosenCate: 'all',
        filterBy: 'cate',
        visiblePopover: false,
    }

    hidePopover = () => {
        this.setState({ visiblePopover: false })
    }

    handleVisibleChangePopover = visiblePopover => {
        this.setState({ visiblePopover });
    };

    handleChangeSelectFilterCate(idClickedCate) {

        const { handleSelectFilter } = this.props;
        this.setState({ idChosenCate: idClickedCate });
        handleSelectFilter(idClickedCate);
    }

    handleChangeSelectFilterMember(idClickedMember) {

        const { handleSelectFilter } = this.props;
        this.setState({ idChosenMember: idClickedMember });
        handleSelectFilter(idClickedMember);
    }

    handleChangeFilterBy = (filterBy) => {
        const { listMembers, allCates } = this.props;

        const idChosenAll = 'all';

        filterBy !== this.state.filterBy ?
            filterBy === 'cate'
                ? this.setState({ filterBy: filterBy, idChosenCate: idChosenAll })
                : this.setState({ filterBy: filterBy, idChosenMember: idChosenAll })
            : null
        this.hidePopover();
    }
    render() {
        const { allMembers, allCates } = this.props;
        const { idChosenCate, idChosenMember, filterBy } = this.state;
        return (
            <div>
                <div className="filter-list-task">
                    <div className="list-task-filter" onClick={(e) => {
                        filterBy === 'member' ? this.handleChangeSelectFilterMember('all') : this.handleChangeSelectFilterCate('all')
                    }}>
                        <Avatar src="https://i.pinimg.com/236x/27/31/e2/2731e233cb4d6580373e2fe205f565ae.jpg"
                            className={(idChosenMember === 'all' && filterBy === "member") || (idChosenCate === 'all' && filterBy === "cate") ? "chosen-task-filter" : "task-filter"}></Avatar>
                        <div className="filter__name-cate">Tất cả</div>
                    </div>
                    {filterBy === 'cate'
                        ? allCates.map(item =>
                            (<div key={item._id} className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterCate(item._id)}>
                                <Avatar src={item.image} className={idChosenCate === item._id ? "chosen-task-filter" : "task-filter"}></Avatar>
                                <div className="filter__name-cate">{item.name}</div>
                            </div>))
                        : allMembers.map(item =>
                            (<div key={item._id} className="list-task-filter" onClick={(e) => this.handleChangeSelectFilterMember(item._id)}>
                                <Avatar src={item.mAvatar.image} className={idChosenMember === item._id ? "chosen-task-filter" : "task-filter"}></Avatar>
                                <div className="filter__name-cate">{item.mName}</div>
                            </div>))
                    }
                    {/* Change type filter */}
                    <Popover
                        className="filter-popover-task"
                        placement="bottom"

                        content={
                            <div className="filter-popover">
                                <div className={filterBy === 'cate' ? "chosen-filter-popover-item" : "filter-popover-item"} onClick={(e) => this.handleChangeFilterBy('cate')}>Loại công việc</div>
                                <div className={filterBy === 'member' ? "chosen-filter-popover-item" : "filter-popover-item"} onClick={(e) => this.handleChangeFilterBy('member')}>Thành viên</div>
                                {/* <div className="hide-popover" onClick={this.hidePopover}>Đóng</div> */}
                            </div>
                        }
                        title="Lọc theo:"
                        trigger="click"
                        visible={this.state.visiblePopover}
                        onVisibleChange={this.handleVisibleChangePopover}
                    >
                        <div className="list-task-filter">
                            <Avatar src="https://static.thenounproject.com/png/1701541-200.png" className="task-filter"></Avatar>
                            <div>Filter</div>
                        </div>
                    </Popover>
                </div>
            </div>
        )
    }
}

export default FilterMain;
