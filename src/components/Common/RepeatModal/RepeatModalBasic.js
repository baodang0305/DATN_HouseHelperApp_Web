import './RepeatModal.css';
import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, Form, DatePicker, Input, TimePicker } from 'antd';

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
}

class BasicRepeatModal extends Component {
    state = {
        typeRepeat: 'no',
        everyRepeat: null,
        isReminderedRepeat: false,
        startRepeat: null,
        dateStartRepeat: null,
        timeStartRepeat: null,
        visibleRepeatModal: false,
    }

    onOkHandle = () => {
        const { receiveDataRepeat } = this.props;
        const { typeRepeat, everyRepeat, isReminderedRepeat, startRepeat, dateStartRepeat, timeStartRepeat } = this.state;
        var startDateTimeRepeat = null;
        if (dateStartRepeat && !timeStartRepeat) {
            startDateTimeRepeat = new Date(dateStartRepeat);
        }
        else if (!dateStartRepeat && timeStartRepeat) {
            startDateTimeRepeat = new Date(moment().format('YYYY-MM-DD') + ' ' + timeStartRepeat);
        }
        else if (dateStartRepeat && timeStartRepeat) {
            startDateTimeRepeat = new Date(dateStartRepeat + ' ' + timeStartRepeat);
        }

        var repeat = {
            type: typeRepeat,
            every: everyRepeat,
            isRemindered: isReminderedRepeat,
            start: startDateTimeRepeat
        }
        receiveDataRepeat(repeat);
    }

    handleOnChangeEveryInput = (e) => {
        const { value } = e.target;
        this.setState({ everyRepeat: parseInt(value) });
    }

    onCancelHandle = () => {

        const { handleClickCancelModalForParent } = this.props;
        this.setState({ visibleRepeatModal: false })
        handleClickCancelModalForParent();
    }

    onChangeChooseDatePicker = (date, dateString) => {

        this.setState({ dateStartRepeat: dateString });
    }

    onChangeChooseTimePicker = (time, timeString) => {
        this.setState({ timeStartRepeat: timeString });
    }

    handleClickChooseType = (type) => {
        if (type === 'no') {
            this.setState({ typeRepeat: type })
        } else {
            this.setState({ typeRepeat: type, everyRepeat: 1 });
        }
    }

    handleClickChooseReminder = (isRemind) => {
        this.setState({ isReminderedRepeat: isRemind })
    }

    render() {
        const { enableRepeatModal, tab } = this.props;
        const arrayType = [
            { type: tab === 'task' ? null : 'no', showType: 'Không lặp' },
            { type: tab === 'task' ? 'daily' : 'day', showType: 'Ngày' },
            { type: tab === 'task' ? 'weekly' : 'week', showType: 'Tuần' },
            { type: tab === 'task' ? 'monthly' : 'month', showType: 'Tháng' },
            { type: tab === 'task' ? 'yearly' : 'year', showType: 'Năm' },
        ]

        const { typeRepeat, visibleRepeatModal, isReminderedRepeat, everyRepeat, dateStartRepeat, timeStartRepeat } = this.state;



        return (
            <Modal
                title={<div className="repeat-modal__title">
                    Cài đặt chế độ lặp
                </div>}
                footer={
                    <div className="repeat-modal__footer">
                        <Button className="repeat-modal__footer--btn" key="back" onClick={this.onCancelHandle}>
                            Đóng
                        </Button>
                        <Button className="repeat-modal__footer--btn" key="submit" type="primary" onClick={this.onOkHandle}>
                            Xác nhận
                        </Button>
                    </div>}
                visible={enableRepeatModal}
                onOk={this.onOkHandle}
                onCancel={this.onCancelHandle}>
                <div className="repeat-modal__container">
                    <div className="repeat-modal__choose-type">
                        {arrayType.map(typeItem =>
                            <div className={`repeat-modal__type ${typeItem.type === typeRepeat ? 'repeat-modal__chosen-type' : null}`} key={typeItem.type} onClick={() => this.handleClickChooseType(typeItem.type)}>
                                {typeItem.showType}
                            </div>)}
                    </div>
                    {typeRepeat === 'no' || typeRepeat === null
                        ? <div className="repeat-modal__no-repeat">Không có cài đặt tùy chọn lặp</div>
                        :
                        <div className="repeat-modal__data-form">
                            <div className="repeat-modal__form-item">
                                <div className="repeat-modal__form-item--label">Thời gian bắt đầu</div>
                                <div className="repeat-modal__form-item--group">
                                    <DatePicker

                                        disabledDate={disabledDate}
                                        placeholder="Ngày bắt đầu"
                                        className="repeat-modal__form-item--input"
                                        onChange={this.onChangeChooseDatePicker} />
                                    <TimePicker className="repeat-modal__form-item--input"
                                        onChange={this.onChangeChooseTimePicker}
                                        use12Hours format="HH:mm"
                                        placeholder="Thời gian"
                                    />
                                </div>
                            </div>

                            {tab === 'task' ? null : <div className="repeat-modal__form-item">
                                <div className="repeat-modal__form-item--label">Khoảng cách lặp</div>

                                <div className="repeat-modal__form-item--group">
                                    <Input type="number"
                                        onChange={this.handleOnChangeEveryInput}
                                        className="repeat-modal__form-item--one"
                                        placeholder="Khoảng cách lặp (Mặc định: 1)" min={0} />
                                </div>

                            </div>}

                            <div className="repeat-modal__form-item">
                                <div className="repeat-modal__form-item--label">Nhắc nhở</div>
                                <div className="repeat-modal__form-item--group">
                                    <div className={`repeat-modal__form-item--input repeat-modal__reminder 
                                     ${isReminderedRepeat || tab === 'task' ? 'repeat-modal__reminder-chosen' : null}`}
                                        onClick={() => { this.handleClickChooseReminder(true) }}>Có nhắc nhở</div>
                                    {tab === 'task' ? null : < div className={`repeat-modal__form-item--input repeat-modal__reminder 
                                     ${!isReminderedRepeat ? 'repeat-modal__reminder-chosen' : null}`}
                                        onClick={() => { this.handleClickChooseReminder(false) }}>Không nhắc nhở</div>}

                                </div>
                            </div>
                        </div>
                    }
                </div>

            </Modal>
        )
    }
}
export default BasicRepeatModal;