import React, { Component } from 'react';
import './FilterMain.css';
import { Avatar, Popover } from 'antd';
import {
    LeftOutlined, RightOutlined
} from '@ant-design/icons';
import { OverflowDetector } from 'react-overflow';
class FilterMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idChosenMember: 'all',
            idChosenCate: 'all',
            filterBy: 'cate',
            orderDateBy: 'decreaseDate',
            orderMoneyBy: 'decreaseMoney',
            visiblePopover: false,
            slider: 0,
            isOverflowed: false,
            widthSlide: 0,
            limit: 0,
            numberTrans: 0,
            recentNumberTrans: 0
        }

        this.Slider = React.createRef();
        this.containerSlide = React.createRef();
    }


    handleOverflowChange = (isOverflowed) => {
        this.setState({ isOverflowed: isOverflowed });
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

    handleChangeOrderDateBy = (orderBy) => {
        this.setState({ orderDateBy: orderBy });
    }

    handleChangeOrderMoneyBy = (orderBy) => {
        this.setState({ orderMoneyBy: orderBy });
    }

    handleFilterSliderLeft = () => {
        const { slider, recentNumberTrans } = this.state;

        this.setState({ slider: slider - 100, recentNumberTrans: recentNumberTrans + 1 });
        console.log(this.Slider)
    }
    handleFilterSliderRight = () => {
        const { slider, recentNumberTrans } = this.state;

        this.setState({ slider: slider + 100, recentNumberTrans: recentNumberTrans - 1 });
        console.log(this.Slider)

    }


    componentDidMount() {
        const limit = this.Slider.current.offsetLeft + 200;
        const widthSlide = this.containerSlide.current.domElement.clientWidth;
        var numberTrans = Math.floor((limit - widthSlide) / 100) + 1;
        this.setState(
            {
                widthSlide: widthSlide,
                limit: limit,
                numberTrans: numberTrans,
                recentNumberTrans: numberTrans
            }
        );
        console.log(limit, widthSlide)
    }

    render() {
        const { allMembers, allCates, tab } = this.props;
        const { idChosenCate, idChosenMember, filterBy, orderDateBy, orderMoneyBy, slider, isOverflowed, numberTrans, recentNumberTrans } = this.state;
        console.log(numberTrans)
        return (

            <div style={{ position: 'relative' }}>
                <div className="filter-slider-left" style={{ display: isOverflowed ? 'flex' : 'none', pointerEvents: recentNumberTrans === numberTrans ? 'none' : null }}
                    onClick={this.handleFilterSliderLeft} >
                    <LeftOutlined />
                </div>
                <div className="filter-slider-right" style={{ display: isOverflowed ? 'flex' : 'none', pointerEvents: recentNumberTrans === 0 ? 'none' : null }}
                    onClick={this.handleFilterSliderRight}>
                    <RightOutlined />
                </div>
                <div style={{ position: 'relative', overflowX: 'hidden' }}>
                    <OverflowDetector ref={this.containerSlide} onOverflowChange={this.handleOverflowChange}
                        className="filter-list-task" style={{
                            padding: isOverflowed ? '0 30px' : null
                            , position: 'relative', left: isOverflowed ? `-${slider}px` : null,
                        }}>

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
                            placement="bottomRight"

                            content={
                                <div className="filter-popover">
                                    <div className={filterBy === 'cate' ? "chosen-filter-popover-item" : "filter-popover-item"} onClick={(e) => this.handleChangeFilterBy('cate')}>Loại công việc</div>
                                    <div className={filterBy === 'member' ? "chosen-filter-popover-item" : "filter-popover-item"} onClick={(e) => this.handleChangeFilterBy('member')}>Thành viên</div>

                                </div>
                            }
                            title="Lọc theo:"
                            trigger="click"
                            visible={this.state.visiblePopover}
                            onVisibleChange={this.handleVisibleChangePopover}
                        >
                            <div className="list-task-filter" ref={this.Slider}>
                                <Avatar src="https://static.thenounproject.com/png/1701541-200.png" className="task-filter"></Avatar>
                                <div className="filter__name-cate">Phân loại</div>
                            </div>
                        </Popover>
                    </OverflowDetector>
                </div>
            </div>
        )

    }
}

export default FilterMain;
