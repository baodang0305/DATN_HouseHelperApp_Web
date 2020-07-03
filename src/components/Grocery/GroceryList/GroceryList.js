import './GroceryList.css';
import React from "react";
import numeral from "numeral";
import { connect } from 'react-redux';
import history from "../../../helpers/history";
import firebase from "firebase";
import { storage } from "../../../helpers/firebaseConfig";

import { Link } from "react-router-dom";
import { Layout, Avatar, Row, Col, Input, Button, Collapse, Modal, Select, Popover, Spin, List, Divider, Tooltip, Form } from "antd";

import { RedoOutlined, ExclamationCircleOutlined, LoadingOutlined, DollarCircleOutlined, QuestionCircleOutlined, CaretRightOutlined, UploadOutlined, SolutionOutlined, MoreOutlined, DeleteOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';
import { familyActions } from "../../../actions/family.actions";
import { groceryActions } from "../../../actions/grocery.actions";


const { Panel } = Collapse;
const { Search } = Input;
const { Header, Content, Footer } = Layout;
const { confirm } = Modal;

class GroceryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActing: false,
            isActive: false,
            idClickedGrocery: null,
            idCheckBoughtItemOfGrocery: null,
            visibleBillModal: false,
            totalCostBill: 0,
            image: null,
            currentUrlImg: "",
            arrayLinkImageBill: [],
            arrayImgBill: [],
            groceryRecent: null,
            idClickedItemInList: null,
            modeCompleteAddBill: false
        }
        this.inputFile = React.createRef();
    }

    handleInputChange = (event) => {
        this.setState({ totalCostBill: event.target.value });

    }

    //Handle when add bill for complete list shopping 
    handleAsyncCheckAndEdit = (callBack) => {
        const { checkBoughtItem, editGrocery } = this.props;
        const { totalCostBill, arrayImgBill, arrayLinkImageBill, idCheckBoughtItemOfGrocery, idClickedGrocery, groceryRecent } = this.state;

        checkBoughtItem(idClickedGrocery, idCheckBoughtItemOfGrocery);
        var bill = arrayLinkImageBill.length > 0 ? arrayLinkImageBill : null;
        callBack(groceryRecent._id,
            groceryRecent.name,
            groceryRecent.stID ? groceryRecent.stID._id : null,
            groceryRecent.assign ? groceryRecent.assign._id : null,
            groceryRecent.repeat,
            groceryRecent.listItems.map(item => {
                item.isChecked = true;
                return item
            }),
            numeral(totalCostBill).value(),
            bill);

    }

    handleOkBillModal = () => {
        const { totalCostBill, arrayLinkImageBill, groceryRecent, modeCompleteAddBill } = this.state;
        const { checkBoughtItem, editGrocery } = this.props;

        if (modeCompleteAddBill) {
            var bill = arrayLinkImageBill.length > 0 ? arrayLinkImageBill : null;
            this.setState({ visibleBillModal: false }, () => {
                editGrocery(groceryRecent._id,
                    groceryRecent.name,
                    groceryRecent.stID ? groceryRecent.stID._id : null,
                    groceryRecent.assign ? groceryRecent.assign._id : null,
                    groceryRecent.repeat,
                    groceryRecent.listItems,
                    numeral(totalCostBill).value(),
                    bill);
            })
        }
        else {
            this.setState({ visibleBillModal: false }, () => {
                this.handleAsyncCheckAndEdit(editGrocery);
            });
        }

    }

    handleCancelBillModal = () => {
        const { totalCostBill, arrayImgBill, arrayLinkImageBill, idCheckBoughtItemOfGrocery, idClickedGrocery, groceryRecent } = this.state;
        const { checkBoughtItem, editGrocery } = this.props;
        this.setState({ visibleBillModal: false }, () => {
            checkBoughtItem(idClickedGrocery, idCheckBoughtItemOfGrocery);
        });

    }

    handleDeleteGrocery = (slID) => {
        const { deleteGrocery } = this.props;
        deleteGrocery(slID);
    }

    handleEditGrocery = (editItem) => {
        history.push("/groceries/edit-grocery", { editItem });
    }

    showDeleteConfirm = (type, slID) => {
        const { deleteGrocery, assignGrocery } = this.props;
        confirm({
            title: type === 'delete' ? 'Bạn muốn xóa mục đã chọn?' : 'Bạn muốn đăng ký phụ trách mục đã chọn?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Có',
            okType: type === 'delete' ? 'danger' : 'primary',
            cancelText: 'Không',
            onOk() {
                if (type === 'delete') {
                    deleteGrocery(slID);
                }
                else {
                    assignGrocery(slID);
                }
            },
            onCancel: () => {
                this.setState({ isActing: false });
            },
        });
    }



    handleClickGrocery = (idClickedGroceryByUser) => {
        const { isActive, idClickedGrocery } = this.state;
        if (idClickedGrocery === idClickedGroceryByUser) {
            this.setState({ isActive: !isActive, idClickedGrocery: null })
        }
        else if (idClickedGrocery !== idClickedGroceryByUser) {
            this.setState({ isActive: true, idClickedGrocery: idClickedGroceryByUser })
        }

    }

    handleCheckBoughtItem = (slID, islID, isCheckedItem, indexItemWantCheck, listItemShopping) => {
        const { checkBoughtItem, editGrocery } = this.props;
        const { groceryRecent } = this.state;
        var checkedTrueItemList = listItemShopping.filter(item => item.isChecked === true);
        console.log(checkedTrueItemList.length, listItemShopping.length);
        if (isCheckedItem === true) {
            var afterUnCheckItem = [...listItemShopping];
            afterUnCheckItem[indexItemWantCheck].isChecked = false;
            afterUnCheckItem = afterUnCheckItem.map(item => {
                return { isChecked: item.isChecked, name: item.name, details: item.details, photo: item.photo }
            })
            editGrocery(groceryRecent._id, groceryRecent.name, groceryRecent.stID ? groceryRecent.stID._id : null, groceryRecent.assign ? groceryRecent.assign._id : null, groceryRecent.repeat, afterUnCheckItem, groceryRecent.total ? groceryRecent.total : null, groceryRecent.bill ? groceryRecent.bill : null);
        } else {

            if (checkedTrueItemList.length === (listItemShopping.length - 1)) {
                this.setState({ idCheckBoughtItemOfGrocery: islID, idClickedGrocery: slID, visibleBillModal: true })
            }
            else if (checkedTrueItemList.length < (listItemShopping.length - 1)) {
                this.setState({ idCheckBoughtItemOfGrocery: islID }, () => {
                    checkBoughtItem(slID, islID);
                })
            }
        }
    }

    handleReUpListShopping = (grocery) => {
        const { addNewGrocery } = this.props;
        var listItemReUp = grocery.listItems.map(item => {
            return {
                name: item.name,
                details: item.details,
                photo: item.photo
            }
        })
        addNewGrocery(grocery.name, grocery.assign ? grocery.assign._id : null, grocery.stID ? grocery.stID._id : null, grocery.repeat, listItemReUp)
    }

    handleAssignGrocery = (slID) => {
        const { assignGrocery } = this.props;
        if (slID) {
            assignGrocery(slID);
        }
    }

    checkIsListComplete = (listShopping) => {
        var isCompletedList = false;
        if (listShopping.every(itemInList => itemInList.isChecked === true)) {
            isCompletedList = true;
        }
        return isCompletedList;
    }
    handleChangeImg = (e) => {
        const { arrayImgBill, arrayLinkImageBill } = this.state;
        this.setState({ arrayImgBill: [...arrayImgBill, { currentUrlImg: URL.createObjectURL(e.target.files[0]), image: e.target.files[0] }] });
        var image = e.target.files[0];
        if (image) {
            const uploadTask = storage.ref().child(`images/${image.name}`).put(image);
            uploadTask.on('state_changed', function (snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            }, (error) => {
                console.log(error)
                return null;
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((photo) => {
                    this.setState({ arrayLinkImageBill: [...arrayLinkImageBill, photo] });
                });
            })
        }
    }

    handleClickDeleteImg = () => {
        this.inputFile.current.value = "";
        this.setState({ currentUrlImg: "", image: null });
    }


    //handle when user want add bill after completing the shopping list (Not add bill before)
    handleCheckAddBillAfter = (recentGrocery) => {
        this.setState({ groceryRecent: recentGrocery, visibleBillModal: true, modeCompleteAddBill: true });
    }

    render() {
        const { allGroceries, loadingCheckBought, user } = this.props;
        const { idClickedItemInList, isActive, idClickedGrocery, idCheckBoughtItemOfGrocery, visibleBillModal, totalCostBill, arrayImgBill, arrayLinkImageBill } = this.state;
        console.log('Du lieu bill', arrayLinkImageBill, totalCostBill)
        return (
            <div>

                <List dataSource={allGroceries}
                    pagination={{ size: 'small', pageSize: 6 }}
                    renderItem={itemGrocery => (
                        <div className="grocery__data-grocery">
                            <div className="grocery__header-container" >
                                <div className="grocery__des-list" onClick={() => this.handleClickGrocery(itemGrocery._id)}>
                                    <CaretRightOutlined style={{ marginRight: 10, color: idClickedGrocery === itemGrocery._id ? this.checkIsListComplete(itemGrocery.listItems) ? '#66BB6A' : '#2985FF' : null }} rotate={isActive && itemGrocery._id === idClickedGrocery ? 90 : 0} />
                                    <div className="grocery__title-list">{itemGrocery.name}</div>
                                    <span>&nbsp;-&nbsp;</span>
                                    {this.checkIsListComplete(itemGrocery.listItems)
                                        ? <div className="grocery__number-item grocery__is-completed">{itemGrocery.listItems.length}</div>
                                        : <div className="grocery__number-item ">{itemGrocery.listItems.length}</div>}
                                </div>

                                <div className="grocery__relative-info">
                                    <div className="grocery__assign-member">
                                        {this.checkIsListComplete(itemGrocery.listItems) ? null : itemGrocery.assign
                                            ? <Tooltip placement="bottom" title={itemGrocery.assign.mName}>
                                                <Avatar src={itemGrocery.assign.mAvatar.image}></Avatar>
                                            </Tooltip>
                                            : null}
                                    </div>

                                    <div className="grocery__actions-list">

                                        {/* <div className="grocery__action">
                                                                        <PaperClipOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Ghim</div>
                                                                    </div>
                                                                    <div className="grocery__action" style={{ color: '#d4b106' }}>
                                                                        <FieldTimeOutlined className="grocery__icon-action" />
                                                                        <div className="grocery__title-action">Dời hạn</div>
                                                                    </div> */}

                                        {this.checkIsListComplete(itemGrocery.listItems)
                                            ? <div className="grocery__data-bill" style={{ marginRight: 10 }}>
                                                {itemGrocery.total ? 'Tổng: ' + numeral(itemGrocery.total).format('0,0[.]00') + ' VND' : null}
                                            </div> : null}

                                        {idClickedGrocery === itemGrocery._id && user.mIsAdmin ?
                                            (this.checkIsListComplete(itemGrocery.listItems)
                                                ? <> {!itemGrocery.bill || !itemGrocery.total ? <div className="grocery__action" style={{ color: '#fa541c' }}
                                                    onClick={() => { this.handleCheckAddBillAfter(itemGrocery) }}>
                                                    <DollarCircleOutlined className="grocery__icon-action" />
                                                    <div className="grocery__title-action">Thêm hóa đơn</div>
                                                </div> : null}

                                                    <div className="grocery__action" style={{ color: '#2985FF' }}
                                                        onClick={() => { this.handleReUpListShopping(itemGrocery) }}>
                                                        <RedoOutlined className="grocery__icon-action" />
                                                        <div className="grocery__title-action">Tạo lại</div>
                                                    </div></>
                                                : <>
                                                    {itemGrocery.assign ? null :
                                                        <div className="grocery__action" style={{ color: "#096dd9" }} onClick={() => {
                                                            this.setState({ isActing: true });
                                                            this.showDeleteConfirm('assign', itemGrocery._id)
                                                        }}>
                                                            <SolutionOutlined className="grocery__icon-action" />
                                                            <div className="grocery__title-action">Đăng ký</div>
                                                        </div>}
                                                    <div className="grocery__action" style={{ color: '#595959' }} onClick={() => {
                                                        this.handleEditGrocery(itemGrocery);
                                                    }}>
                                                        <EditOutlined className="grocery__icon-action" />
                                                        <div className="grocery__title-action" >Sửa</div>
                                                    </div>
                                                    <div className="grocery__action" style={{ color: '#f5222d' }} onClick={() => {
                                                        this.setState({ isActing: true });
                                                        this.showDeleteConfirm('delete', itemGrocery._id)
                                                    }}>
                                                        <DeleteOutlined className="grocery__icon-action" />
                                                        <div className="grocery__title-action">Xóa</div>
                                                    </div>
                                                </>) : null}
                                    </div>
                                </div>
                            </div>

                            {isActive && itemGrocery._id === idClickedGrocery ?
                                <div className="grocery__list-item-container">
                                    <List
                                        dataSource={itemGrocery.listItems}
                                        renderItem={(item, index) =>
                                            <List.Item className="grocery__item-container">
                                                <div className="grocery__quick-check-container">
                                                    {loadingCheckBought && item._id === idCheckBoughtItemOfGrocery ?
                                                        <LoadingOutlined style={{ fontSize: 28, color: '#2985ff' }} />
                                                        : <div className="grocery__quick-check">
                                                            <input checked={item.isChecked ? true : false}
                                                                onChange={(e) => {
                                                                    this.setState({ groceryRecent: itemGrocery }, () => {
                                                                        this.handleCheckBoughtItem(itemGrocery._id, item._id, item.isChecked, index, itemGrocery.listItems)
                                                                    });

                                                                }}
                                                                type="checkbox" key={item.name} id={`${item.name}`} className="check-box-task" />
                                                            <label htmlFor={`${item.name}`}></label>
                                                        </div>}

                                                </div>
                                                <div className="grocery__info-item" onClick={() => {
                                                    const { idClickedItemInList } = this.state;
                                                    this.setState({ idClickedItemInList: idClickedItemInList === item._id ? null : item._id })
                                                }}>
                                                    <div className="grocery__des-info-item">
                                                        <div className="grocery__name-item">{item.name}</div>
                                                        <div className="grocery__note-item">{item.details}</div>
                                                    </div>
                                                    <div className="grocery__image-item" style={{ height: '100%' }}>
                                                        {item.photo ? <img src={item.photo} style={{ height: '100%', objectFit: 'contain' }} /> : null}
                                                    </div>
                                                    {idClickedItemInList === item._id && user.mIsAdmin ?
                                                        (item.isChecked ? null :
                                                            <div className="grocery__action-item">
                                                                <div className="grocery__action" style={{ color: '#595959' }}>
                                                                    <EditOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action" >Sửa</div>
                                                                </div>
                                                                <div className="grocery__action" style={{ color: '#f5222d' }}>
                                                                    <DeleteOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action">Xóa</div>
                                                                </div>
                                                            </div>) : null
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
                <Modal
                    className="grocery__bill-modal"
                    title="Nhập thông tin hóa đơn mua sắm"
                    visible={visibleBillModal}
                    onOk={this.handleOkBillModal}
                    onCancel={this.handleCancelBillModal}
                    okText="Thêm"
                    okButtonProps={{ disabled: totalCostBill ? false : true }}
                    cancelText="Để sau"
                >
                    <Form name="basic"
                        layout="vertical"
                    >
                        <div className="grocery__modal-hint">
                            <QuestionCircleOutlined style={{ fontSize: 15 }} />&nbsp;
                             Nhập tổng giá trị hóa đơn hoặc kèm hình ảnh chi tiết (Không bắt buộc)
                        </div>
                        <Form.Item label={
                            <div>Giá của hóa đơn mua sắm (vnd)</div>
                        }
                            className="grocery__modal-form-item">
                            <Input type="text" onChange={this.handleInputChange}
                                value={totalCostBill ? numeral(totalCostBill).format('0,0[.]00') : null}
                                placeholder="Nhập giá trị của danh sách mua sắm"
                            ></Input>
                        </Form.Item>
                        <Form.Item label={<div>Hình ảnh minh họa</div>} className="grocery__modal-form-item">
                            <Row className="row-form-item-add-event">
                                <Col xl={24} lg={24} sm={24} xs={24} className="grocery__bill-modal-image-container" >
                                    <div className="grocery__bill-modal-list-image">
                                        {arrayImgBill.length !== 0
                                            &&
                                            arrayImgBill.map((imageBill, index) =>
                                                <img key={index} src={imageBill.currentUrlImg} style={{
                                                    justifyContent: arrayImgBill.length === 3 ? 'space-between' : 'flex-start',
                                                    marginRight: arrayImgBill.length < 3 ? '10px' : null
                                                }} className="grocery__bill-modal-image" />)}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className="upload-img-add-calendar-container" style={{ marginTop: arrayImgBill.length ? 5 : 0 }}>
                                            <div className="upload-img-ui-add-canlendar" >
                                                <UploadOutlined style={{ fontSize: 16 }} />
                                                    &emsp;
                                                    <span style={{ fontSize: 16 }}>{!arrayImgBill.length ? "Chọn ảnh" : "Chọn thêm ảnh"}</span>
                                            </div>
                                            <input ref={this.inputFile} className="input-file-add-calendar" type="file" onChange={this.handleChangeImg} />
                                        </div>
                                        {arrayImgBill.length ? <div className="delete-img-button" onClick={this.handleClickDeleteImg}>Xóa ảnh</div> : null}
                                    </div>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.inforLogin.user,
    token: state.authentication.inforLogin.token,
    loadingCheckBought: state.grocery.loadingCheckBought
})
const actionCreators = {
    deleteGrocery: groceryActions.deleteGrocery,
    checkBoughtItem: groceryActions.checkBoughtItem,
    addNewGrocery: groceryActions.addGrocery,
    assignGrocery: groceryActions.assignGrocery,
    editGrocery: groceryActions.editGrocery,
}
export default connect(mapStateToProps, actionCreators)(GroceryList);