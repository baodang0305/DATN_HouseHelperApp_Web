import React, { Component } from 'react'
import { Layout, Row, Col, Button, Form, Input, Avatar, DatePicker, Select, Spin, Alert, Modal, Divider } from "antd";
import {
    RedoOutlined,
    LeftOutlined,
    TeamOutlined,
    BellOutlined,
    CheckOutlined,
    RightOutlined,
    UploadOutlined,
    PictureOutlined,
    LoadingOutlined,
    SnippetsOutlined,
    CalendarOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import moment from 'moment';

class RepeatModal extends Component {
    state = {
        repeatTypeOfMonth: 'day',
        repeatTypeOfYear: 'day',
        repeat: { type: "no-repeat", end: null, day: [], date: null, order: null, month: null },
        dateTime: { start: null, end: null },

        errorModalForm: "",
        activeTabNestedRepeatType: 'day',
        showRepeatModal: false,
    }
    // mapRepeatEventEditToRepeatForm = () => {
    //     let { repeat, repeatTypeOfMonth, repeatTypeOfYear, activeTabNestedRepeatType } = this.state;
    //     const { event } = history.location.state;

    //     if (event.repeat) {
    //         repeat.end = event.repeat.end;
    //         if (event.repeat.type === "day") {
    //             repeat.type = "day";
    //         }
    //         else if (event.repeat.type === "week") {
    //             repeat.type = "week";
    //             repeat.day = event.repeat.day ? event.repeat.day : [];
    //         }
    //         else if (event.repeat.type === "month") {
    //             repeat.type = "month";
    //             if (event.repeat.date) {
    //                 repeat.date = event.repeat.date;
    //                 repeatTypeOfMonth = "date"
    //             }
    //             else {
    //                 repeat.order = event.repeat.order;
    //                 repeat.day = [...event.repeat.day];
    //                 repeatTypeOfMonth = "day";
    //                 activeTabNestedRepeatType = "day";
    //             }
    //         }
    //         else if (event.repeat.type === "year") {
    //             repeat.type = "year";
    //             repeat.month = event.repeat.month;
    //             if (event.repeat.date) {
    //                 repeat.date = event.repeat.date;
    //                 repeatTypeOfYear = "date";
    //                 activeTabNestedRepeatType = "date";
    //             }
    //             else {
    //                 repeatTypeOfYear = "day";
    //                 repeat.order = event.repeat.order;
    //                 repeat.day = [...event.repeat.day];
    //                 activeTabNestedRepeatType = "day";
    //             }
    //         }
    //     }
    //     else {
    //         repeat.type = "no-repeat"
    //     }

    //     this.setState({
    //         repeat,
    //         repeatTypeOfMonth,
    //         repeatTypeOfYear,
    //         activeTabNestedRepeatType,
    //     });

    // }

    handleSelectStartDate = (date, dateString) => {
        const { dateTime } = this.state;
        if (dateString) { dateTime.start = new Date(dateString) }
        else { dateTime.start = null }
        this.setState({ dateTime });
    }

    handleSelectEndDate = (date, dateString) => {
        const { dateTime } = this.state;
        if (dateString) { dateTime.end = new Date(dateString) }
        else { dateTime.end = null }
        this.setState({ dateTime });
    }

    handleSelectEndtDateRepeat = (date, dateString) => {
        const { repeat } = this.state;
        if (date) { repeat.end = date._d }
        else { repeat.end = null }
        this.setState({ repeat });
    }
    handleSelectDaysOfWeek = (value) => {
        const { repeat } = this.state;
        const indexItem = (repeat && repeat.day && repeat.day.length > 0) ? repeat.day.findIndex(item => item === value) : -1;
        if (indexItem === -1) {
            repeat.type === "week"
                ? repeat.day = [...repeat.day, value]
                : repeat.day = [...value]
        }
        else {
            repeat.day.splice(indexItem, 1);
        }
        this.setState({ repeat });
    }


    renderOrderWeekOfMonth = () => {
        const { repeat } = this.state
        const children = [];
        for (let i = 0; i <= 5; i++) {
            children.push(
                <div key={i} className="avatar-custom-container"
                    onClick={() => {
                        repeat.order === i
                            ? repeat.order = null
                            : repeat.order = i
                        this.setState({ repeat })
                    }}
                >
                    <Avatar size={30}
                        style={{
                            fontSize: 12, opacity: repeat.order === i ? 0.5 : 1,
                            borderColor: repeat.order === i && '#1890ff',
                            borderStyle: repeat.order === i && 'groove',
                            borderWidth: repeat.order === i && 2,
                        }} >{i}</Avatar>
                    {repeat.order === i ? <CheckOutlined className="check-selected-day-of-week" /> : null}
                </div>
            )
        }
        return children;
    }

    convertDayOfWeek = (item) => {
        const result =
            item === 1 && "T2" ||
            item === 2 && "T3" ||
            item === 3 && "T4" ||
            item === 4 && "T5" ||
            item === 5 && "T6" ||
            item === 6 && "T7" ||
            item === 0 && "CN"
        return result;
    }

    checkSelectedDayOfWeek = (value) => {
        const { repeat } = this.state;
        return repeat && repeat.day && repeat.day.length > 0 ? repeat.day.findIndex(item => item === value) : -1;
    }

    renderDayOfWeek = () => {
        const children = [];
        for (let i = 0; i <= 6; i++) {
            children.push(
                <div className="avatar-custom-container" onClick={() => this.handleSelectDaysOfWeek(i)} key={i} >
                    <Avatar size={30}
                        style={{
                            fontSize: 12, opacity: this.checkSelectedDayOfWeek(i) !== -1 ? 0.5 : 1,
                            borderColor: this.checkSelectedDayOfWeek(i) !== -1 && '#1890ff',
                            borderStyle: this.checkSelectedDayOfWeek(i) !== -1 && 'groove',
                            borderWidth: this.checkSelectedDayOfWeek(i) !== -1 && 2,
                        }}
                    >{this.convertDayOfWeek(i)}</Avatar>
                    {this.checkSelectedDayOfWeek(i) !== -1 ? <CheckOutlined className="check-selected-day-of-week" /> : null}
                </div>
            )
        }
        return children;
    }

    renderDateOfMonth = () => {
        const { repeat } = this.state;
        const children = [];
        for (let i = 0; i <= 31; i++) {
            children.push(
                <div style={{ textAlign: "center" }} key={i}>
                    <div className="date-of-month-modal-item" >
                        <Avatar
                            size={30}
                            style={{
                                fontSize: 12, opacity: repeat.date === i ? 0.5 : 1,
                                borderColor: repeat.date === i && '#1890ff',
                                borderStyle: repeat.date === i && 'groove',
                                borderWidth: repeat.date === i && 2,
                            }}
                            onClick={() => { repeat.date = i; this.setState({ repeat }); }}
                        >{i}</Avatar>
                        {repeat.date === i
                            ? <CheckOutlined
                                className="check-selected-date-of-month"
                                onClick={() => { repeat.date = null; this.setState({ repeat }) }}
                            />
                            : null
                        }
                    </div>
                </div>
            )
        }
        return children;
    }

    renderMonthOfYear = () => {
        const { repeat } = this.state;
        const children = [];
        for (let i = 0; i <= 11; i++) {
            children.push(
                <div className="avatar-custom-container"
                    onClick={() => {
                        repeat.month === i
                            ? repeat.month = null
                            : repeat.month = i
                        this.setState({ repeat });
                    }} key={i} >
                    <Avatar size={30} key={i}
                        style={{
                            fontSize: 12, opacity: repeat.month === i ? 0.5 : 1,
                            borderColor: repeat.month === i && '#1890ff',
                            borderStyle: repeat.month === i && 'groove',
                            borderWidth: repeat.month === i && 2,
                        }}
                    >T{i + 1}</Avatar>
                    {repeat.month === i ? <CheckOutlined className="check-selected-day-of-week" /> : null}
                </div>
            )
        }
        return children;
    }

    handleRepeatCancelModal = () => {
        const { type } = this.props;
        const { repeat } = this.state;
        if (type === "add") {
            repeat.type = "no-repeat";
            this.setState({ repeat, showRepeatModal: false });
            this.props.handleClickCancelModalForParent();
        }
        else {
            // this.mapRepeatEventEditToRepeatForm();
            this.setState({ showRepeatModal: false });
            this.props.handleClickCancelModalForParent();
        }
    }

    handleRepeatSaveModal = () => {
        const { repeat, repeatTypeOfMonth, repeatTypeOfYear } = this.state;
        let error = "";
        if (repeat.type === "week") {
            error = (!repeat.day || repeat.day.length <= 0) ? "Yêu cầu chọn: Thứ (lặp theo tuần thứ/tuần)" : ""
        }
        else if (repeat.type === "month") {
            repeatTypeOfMonth === "day"
                ?
                (
                    error = (!repeat.day || repeat.day.length <= 0) ? "Thứ" : "",
                    error = (repeat.order === null || repeat.order === undefined) ? (error ? (error + ", Tuần Thứ") : "Tuần Thứ") : error,
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo tháng thứ/tuần/tháng)") : ""
                )
                :
                (
                    error = (repeat.date === null | repeat.date === undefined) ? "Ngày" : "",
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo tháng ngày/tháng)") : ""
                )
        }
        else if (repeat.type === "year") {
            repeatTypeOfYear === "day"
                ? (
                    error = (!repeat.day || repeat.day.length <= 0) ? "Thứ" : "",
                    error = (repeat.order === null || repeat.order === undefined) ? (error ? (error + ", Tuần Thứ") : "Tuần Thứ") : error,
                    error = (repeat.month === null || repeat.month === undefined) ? (error ? (error + ", Tháng") : "Tháng") : error,
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo năm thứ/tuần/tháng/năm)") : ""
                )
                :
                (
                    error = (repeat.date === null || repeat.date === undefined) ? "Ngày" : "",
                    error = (repeat.month === null || repeat.month === undefined) ? (error ? (error + ", Tháng") : "Tháng") : error,
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo năm ngày/tháng/năm)") : ""
                )
        }
        error ? this.setState({ errorModalForm: error }) : this.setState({ showRepeatModal: false, errorModalForm: "" });
    }
    render() {
        const { repeat,
            repeatTypeOfMonth, repeatTypeOfYear, activeTabNestedRepeatType, showRepeatModal, errorModalForm
        } = this.state;

        const { enableRepeatModal } = this.props;
        const checkDayTabActive = () => {
            if (
                repeat.type === "week"
                ||
                (repeat.type === "month" && repeatTypeOfMonth === "day" && activeTabNestedRepeatType === "day")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "day")
            ) return true;
            else return false;
        }

        const checkOrderTabActive = () => {
            if (
                (repeat.type === "month" && repeatTypeOfMonth === "day" && activeTabNestedRepeatType === "order")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "order")
            ) return true;
            else return false;
        }

        const checkMonthTabActive = () => {
            if (
                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "month")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "date" && activeTabNestedRepeatType === "month")
            ) return true;
            else return false;
        }

        const checkDateTabActive = () => {
            if (
                (repeat.type === "month" && repeatTypeOfMonth === "date")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "date" && activeTabNestedRepeatType === 'date')
            ) return true;
            else return false;
        }

        const convertRepeatType = () => {
            const result =
                (repeat.type === "no-repeat" && "Không lặp")
                || (repeat.type === "day" && "Mõi ngày")
                || (repeat.type === "week" && "Tuần")
                || (repeat.type === "month" && "Tháng")
                || (repeat.type === "year" && "Năm")
            return result;
        }
        return (

            <Modal width={450} closable={false} footer={null} title={null} visible={enableRepeatModal} >
                <div className="body-modal">
                    <div className="title-modal-container" >
                        <p className="title-repeat-modal">Lặp Lại</p>
                        {errorModalForm &&
                            <Alert type="error" className="form-item-add-event alert-error-submit-form" message={errorModalForm} />
                        }
                        <div className="repeat-type-modal-container">
                            <div
                                className={`repeat-type-item-modal ${repeat.type === "no-repeat" && "repeat-type-item-modal-selected"} `}
                                onClick={() => { repeat.type = "no-repeat"; this.setState({ repeat }); }}
                            >Không</div>
                            <div className={`repeat-type-item-modal ${repeat.type === "day" && "repeat-type-item-modal-selected"} `}
                                onClick={() => {
                                    repeat.type = "day";
                                    repeat.day = [];
                                    repeat.order = null;
                                    repeat.month = null;
                                    repeat.date = null;
                                    this.setState({ repeat });
                                }}
                            >Ngày</div>
                            <div className={`repeat-type-item-modal ${repeat.type === "week" && "repeat-type-item-modal-selected"} `}
                                onClick={() => {
                                    repeat.type = "week";
                                    repeat.day = [];
                                    repeat.order = null;
                                    repeat.month = null;
                                    repeat.date = null;
                                    this.setState({ repeat });
                                }}
                            >Tuần</div>
                            <div className={`repeat-type-item-modal ${repeat.type === "month" && "repeat-type-item-modal-selected"} `}
                                onClick={() => {
                                    repeat.type = "month";
                                    repeat.day = [];
                                    repeat.order = null;
                                    repeat.month = null;
                                    repeat.date = null;
                                    this.setState({ repeat });
                                }}
                            >Tháng</div>
                            <div className={`repeat-type-item-modal ${repeat.type === "year" && "repeat-type-item-modal-selected"} `}
                                onClick={() => {
                                    repeat.type = "year";
                                    repeat.day = [];
                                    repeat.order = null;
                                    repeat.month = null;
                                    repeat.date = null;
                                    this.setState({ repeat });
                                }}
                            >Năm</div>
                        </div>
                    </div>

                    <Divider />

                    {repeat.type === "no-repeat"
                        ? null
                        : <DatePicker
                            style={{ width: '80%' }}
                            value={repeat.end ? moment(repeat.end) : null}
                            onChange={this.handleSelectEndtDateRepeat}
                            placeholder="Ngày kết thúc"
                        />
                    }

                    {(repeat.type === "month" || repeat.type === "year") &&
                        <div style={{ width: "80%", display: 'flex', justifyContent: 'space-between', margin: '10px 0px' }}>
                            <Button
                                style={{ width: "48%" }}
                                type={
                                    (
                                        (repeat.type === "month" && repeatTypeOfMonth === "day")
                                        ||
                                        (repeat.type === "year" && repeatTypeOfYear === "day")
                                    ) ? "primary" : ""
                                }
                                ghost={
                                    (
                                        (repeat.type === "month" && repeatTypeOfMonth === "day")
                                        ||
                                        (repeat.type === "year" && repeatTypeOfYear === "day")
                                    ) ? true : false
                                }
                                onClick={() => {
                                    repeat.type === "month"
                                        ? this.setState({ repeatTypeOfMonth: "day" })
                                        : this.setState({ repeatTypeOfYear: "day" })
                                }
                                }>Theo thứ</Button>
                            <Button
                                style={{ width: "48%" }}
                                type={
                                    (
                                        (repeat.type === "month" && repeatTypeOfMonth === "date")
                                        ||
                                        (repeat.type === "year" && repeatTypeOfYear === "date")
                                    ) ? "primary" : ""
                                }
                                ghost={
                                    (
                                        (repeat.type === "month" && repeatTypeOfMonth === "date")
                                        ||
                                        (repeat.type === "year" && repeatTypeOfYear === "date")
                                    ) ? true : false
                                }
                                onClick={() => {
                                    repeat.type === "month"
                                        ? this.setState({ repeatTypeOfMonth: "date" })
                                        : this.setState({ repeatTypeOfYear: "date" })
                                }
                                }>Theo ngày</Button>
                        </div>
                    }

                    < div className="nested-repeat-type-modal-container">
                        {(
                            repeat.type === "week"
                            ||
                            (repeat.type === "month" && repeatTypeOfMonth === "day")
                            ||
                            (repeat.type === "year" && repeatTypeOfYear === "day")
                        ) && <div
                            className="nested-repeat-type-item-modal"
                            style={{
                                color: checkDayTabActive() && "#1890ff",
                                borderBottomColor: checkDayTabActive() && "#1890ff",
                                fontWeight: checkDayTabActive() && 'bold'
                            }}
                            onClick={() => this.setState({ activeTabNestedRepeatType: 'day' })}> Thứ </div>}
                        {(
                            (repeat.type === "month" && repeatTypeOfMonth === "day")
                            ||
                            (repeat.type === "year" && repeatTypeOfYear === "day")
                        ) && <div
                            className="nested-repeat-type-item-modal"
                            style={{
                                color: checkOrderTabActive() && "#1890ff",
                                borderBottomColor: checkOrderTabActive() && "#1890ff",
                                fontWeight: checkOrderTabActive() && 'bold'
                            }}
                            onClick={() => this.setState({ activeTabNestedRepeatType: 'order' })}>Tuần Thứ</div>}
                        {(
                            (repeat.type === "month" && repeatTypeOfMonth === "date")
                            ||
                            (repeat.type === "year" && repeatTypeOfYear === "date")
                        ) && <div
                            className="nested-repeat-type-item-modal"
                            style={{
                                color: checkDateTabActive() && "#1890ff",
                                borderBottomColor: checkDateTabActive() && "#1890ff",
                                fontWeight: checkDateTabActive() && 'bold'
                            }}
                            onClick={() => this.setState({ activeTabNestedRepeatType: "date" })} >Ngày</div>
                        }
                        {(repeat.type === "year")
                            && <div
                                className="nested-repeat-type-item-modal"
                                style={{
                                    color: checkMonthTabActive() && "#1890ff",
                                    borderBottomColor: checkMonthTabActive() && "#1890ff",
                                    fontWeight: checkMonthTabActive() && 'bold'
                                }}
                                onClick={() => this.setState({ activeTabNestedRepeatType: "month" })
                                }>Tháng</div>
                        }
                    </div>

                    {
                        (
                            (repeat.type === "month" && repeatTypeOfMonth === "day")
                            ||
                            (repeat.type === "year" && repeatTypeOfYear === "day")
                        )
                        && activeTabNestedRepeatType === "order" &&
                        <div className="order-week-of-month-modal-container">
                            {this.renderOrderWeekOfMonth()}
                        </div>
                    }

                    {
                        (repeat.type === "week" ||
                            (
                                (
                                    (repeat.type === "month" && repeatTypeOfMonth === "day")
                                    ||
                                    (repeat.type === "year" && repeatTypeOfYear === "day")
                                ) && activeTabNestedRepeatType === "day")
                        ) &&
                        <div className="day-of-week-modal-container">
                            {this.renderDayOfWeek()}
                        </div>
                    }

                    {
                        (
                            (repeat.type === "month" && repeatTypeOfMonth === "date")
                            ||
                            (
                                repeat.type === "year"
                                && repeatTypeOfYear === "date"
                                && activeTabNestedRepeatType === "date"
                            )
                        )
                        && <div className="date-of-month-modal-container">
                            <LeftOutlined onClick={this.handleClickDateOfMonthPre} />
                            <div ref={this.scrollBarDateOfmonth} className="date-of-month-modal">
                                {this.renderDateOfMonth()}
                            </div>
                            <RightOutlined onClick={this.handleClickDateOfMonthNext} />
                        </div>
                    }

                    {repeat.type === "year" && activeTabNestedRepeatType === "month" &&
                        <div className="month-of-year-modal-container">
                            {this.renderMonthOfYear()}
                        </div>
                    }
                    {(
                        (repeat.type === "month" && repeatTypeOfMonth === "day" && activeTabNestedRepeatType === "order")
                        ||
                        (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "order")
                    ) && <div style={{ margin: '20px 0px 0px 0px', color: '#1890ff' }}>Ghi chú: 0 là tuần cuối của tháng.</div>
                    }
                    {
                        (
                            (repeat.type === "month" && repeatTypeOfMonth === "date")
                            ||
                            (repeat.type === "year" && repeatTypeOfYear === "date" && activeTabNestedRepeatType === "date")
                        ) && <div style={{ margin: '20px 0px 0px 0px', color: '#1890ff' }}>Ghi chú: 0 là ngày cuối cùng của tháng</div>
                    }
                    <Divider />

                    <div className="footer-modal">
                        <Button onClick={this.handleRepeatCancelModal} className="cancel-button-modal" ghost type="primary">Đóng</Button>
                        <Button onClick={this.handleRepeatSaveModal} className="save-button-modal" type="primary">Lưu Lại</Button>
                    </div>

                </div>
            </Modal>


        )
    }
}

export default RepeatModal;