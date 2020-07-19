import './DataFormGrocery.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


import {
    LeftOutlined, ShoppingCartOutlined, PlusOutlined,
    AppstoreAddOutlined, EditOutlined, TeamOutlined,
    DeleteOutlined, RetweetOutlined, CheckOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Form, Input, Button, Row, Col, Select, Avatar, Layout, Tooltip, Alert, Spin, Divider, List
} from 'antd';
import firebase from "firebase";
import { storage } from "../../../helpers/firebaseConfig";
import history from "../../../helpers/history";

import BasicRepeatModal from "../../Common/RepeatModal/RepeatModalBasic";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from "../../../actions/family.actions";
import { groceryActions } from "../../../actions/grocery.actions";
import { groceryTypeActions } from "../../../actions/grocery.type.actions";

const { Header, Content } = Layout;

class DataFormGrocery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idEditItem: null,
            nameOfList: null,
            assignedMembersOfList: null,
            checkedGroceryType: null,
            repeatOfList: null,
            listItemOfList: [],
            nameOfItem: null,
            noteOfItem: null,
            imgOfItem: null,
            enableRepeatModal: false,
            image: null,
            validateForm: null,
            currentUrlImg: "",
            textRepeat: null,
            isLoading: false,
            isEditing: false,
            indexEditing: 0,
        }
        this.inputFile = React.createRef();
    }


    componentDidMount() {
        this.checkValidateForm();
        const { getListMembers, getAllGroceryTypes } = this.props;
        getListMembers();
        getAllGroceryTypes();
        const { type } = this.props;
        if (type === 'edit') {
            const { editItem } = history.location.state;
            console.log('edit Item ', editItem);
            this.setState({
                idEditItem: editItem._id,
                nameOfList: editItem.name,
                assignedMembersOfList: editItem.assign ? editItem.assign._id : null,
                checkedGroceryType: editItem.stID ? editItem.stID._id : null,
                repeatOfList: null,
                listItemOfList: editItem.listItems,
            })


        }
    }

    handleClickBack = () => {
        history.push("/grocery");
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleClickChooseMember = (idMember) => {
        const { assignedMembersOfList } = this.state;
        this.setState({ assignedMembersOfList: idMember });
    }

    //Handle click choose a item to edit
    handleClickEditItem = (item, index) => {
        this.setState({
            nameOfItem: item.name,
            noteOfItem: item.details,
            imgOfItem: item.photo,
            isEditing: true,
            indexEditing: index
        });
    }

    //Handle when click check a shopping type
    handleClickChooseType = (idType) => {
        const { checkedGroceryType } = this.state;
        if (idType === 'add-grocery-type') {
            history.push('/grocery-type/add-type');
        }
        this.setState({ checkedGroceryType: idType });

    }

    //handle when add a item into shopping item list 
    handleAddAItem = () => {

        const { nameOfItem, noteOfItem, listItemOfList, currentUrlImg, image, isEditing, indexEditing } = this.state;
        var indexOfItemInList = listItemOfList.findIndex(itemShopping => itemShopping.name === nameOfItem);

        if (indexOfItemInList === -1 && !isEditing || isEditing) {
            if (image) {
                const uploadTask = storage.ref().child(`images/${image.name}`).put(image);
                uploadTask.on('state_changed', (snapshot) => {
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
                    console.log(error);
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((imgURL) => {
                        console.log('du lieu anh', imgURL);

                        if (isEditing) {
                            listItemOfList[indexEditing].name = nameOfItem;
                            listItemOfList[indexEditing].details = noteOfItem;
                            listItemOfList[indexEditing].photo = imgURL;
                            this.setState({ listItemOfList: [...listItemOfList], isEditing: false });
                        }
                        else {
                            listItemOfList.push({ name: nameOfItem, details: noteOfItem, photo: imgURL })
                            this.setState({ listItemOfList: listItemOfList, isEditing: false });
                        }
                        this.inputFile.current.value = "";
                        this.setState({ nameOfItem: null, noteOfItem: null, currentUrlImg: "", image: null, isEditing: false });
                    });
                });
            }
            else {

                if (isEditing) {
                    listItemOfList[indexEditing].name = nameOfItem;
                    listItemOfList[indexEditing].details = noteOfItem;
                    listItemOfList[indexEditing].photo = '';
                    this.setState({ listItemOfList: [...listItemOfList], isEditing: false });
                } else {
                    this.setState({ listItemOfList: [...listItemOfList, { name: nameOfItem, details: noteOfItem, photo: null }], isEditing: false });
                }
                this.inputFile.current.value = "";

                this.setState({ nameOfItem: null, noteOfItem: null, currentUrlImg: "", image: null, isEditing: false });
            }
        }
    }

    //Handle when delete a item from shopping item list 
    handleDeleteItem = (item) => {
        const { nameOfItem, noteOfItem, listItemOfList } = this.state;
        var indexOfItemInList = listItemOfList.findIndex(itemShopping => itemShopping.name === item.name);
        if (indexOfItemInList !== -1) {
            listItemOfList.splice(indexOfItemInList, 1);
            this.setState({ listItemOfList: [...listItemOfList] })
        }
    }

    //Check item that appear in array
    isItemInArray = (arr, item) => {
        return arr.some(i => i === item);
    }

    //Handle to show Repeat Modal
    clickToShowRepeatModal = () => {
        this.setState({ enableRepeatModal: true });
    }

    clickCancelRepeatModal = () => {
        this.setState({ enableRepeatModal: false });
    }

    handleChangeImg = (e) => {
        this.setState({ currentUrlImg: URL.createObjectURL(e.target.files[0]), image: e.target.files[0] });
    }

    handleClickDeleteImg = () => {
        this.inputFile.current.value = "";
        this.setState({ currentUrlImg: "", image: null });
    }

    checkValidateForm = () => {
        const { allGroceries } = this.props;
        const { idEditItem, nameOfList, assignedMembersOfList, repeatOfList, checkedGroceryType, listItemOfList, } = this.state;
        var isValidated = true;
        var errMessage = { errMessageName: null, errMessageListItem: null };
        if (!nameOfList) {
            errMessage.errMessageName = "Tên danh sách mua sắm không để trống";
            isValidated = false;
        }
        else if (listItemOfList.length === 0) {
            errMessage.errMessageListItem = "Danh sách vật phẩm mua không để trống";
            isValidated = false;
        }
        else if (allGroceries.some(item => item.name === nameOfList)) {
            isValidated = false;
        }
        var validateForm = { isValidated, errMessage };
        return validateForm;
    }


    //Callback when call from repeat modal to set Repeat Data
    receiveDataRepeat = (dataRepeat) => {
        var textRepeat = null;
        if (dataRepeat) {
            switch (dataRepeat.type) {
                case 'no': {
                    textRepeat = 'Không lặp';
                    break;
                }
                case 'day': {
                    textRepeat = 'Lặp cách ' + dataRepeat.every + ' ngày' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                    break;
                }
                case 'week': {
                    textRepeat = 'Lặp cách ' + dataRepeat.every + ' tuần' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                    break;
                }
                case 'month': {
                    textRepeat = 'Lặp cách ' + dataRepeat.every + ' tháng' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                    break;
                }
                case 'year': {
                    textRepeat = 'Lặp cách ' + dataRepeat.every + ' năm' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                    break;
                }
                default:
                    break;
            }
        }
        this.setState({ repeatOfList: dataRepeat, enableRepeatModal: false, textRepeat: textRepeat });

    }

    handleSubmit = () => {
        const { addNewGrocery, type, editGrocery } = this.props;
        const { idEditItem, nameOfList, assignedMembersOfList, repeatOfList, checkedGroceryType, listItemOfList, } = this.state;
        type === 'add'
            ? this.setState({ isLoading: true }, () => {
                addNewGrocery(nameOfList, assignedMembersOfList, checkedGroceryType, repeatOfList, listItemOfList)
            })
            : this.setState({ isLoading: true }, () => {
                editGrocery(idEditItem, nameOfList, checkedGroceryType, assignedMembersOfList, repeatOfList, listItemOfList);
            })
    }
    render() {
        const { type, listMembers, allGroceryTypes } = this.props;
        const { enableRepeatModal, nameOfList, assignedMembersOfList, repeatOfList, checkedGroceryType, listItemOfList,
            nameOfItem, noteOfItem, currentUrlImg, image,
            validateForm, textRepeat, isLoading, isEditing
        } = this.state;

        console.log(nameOfList, assignedMembersOfList, checkedGroceryType, repeatOfList, listItemOfList, currentUrlImg, image);
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="5" />
                <Layout className="site-layout">
                    <Header className="header-container" style={{ padding: '0' }}>
                        <div className="grocery-form__header">
                            <div
                                className="header__btn-link"
                                onClick={this.handleClickBack}
                                size="large">
                                <LeftOutlined onClick={() => { this.handleClickBack }} className="header__icon-btn" />
                            </div>
                            <div className="grocery-form__header-title">{type === 'add' ? 'Tạo danh sách' : 'Sửa danh sách'}</div>
                        </div>
                    </Header>
                    <Content className="grocery-form__content">
                        <Form onFinish={this.handleSubmit}
                            layout="vertical" name="grocery-form" className="grocery-form__form-container">
                            <Form.Item className="grocery-form__form-item">
                                <Input className="grocery-form__input-name"
                                    value={nameOfList ? nameOfList : null}
                                    name="nameOfList"
                                    onChange={this.handleChangeInput} size="large" placeholder="Tên danh sách mua sắm"
                                />
                            </Form.Item>

                            {/* Show list member to set up*/}
                            <Form.Item className="grocery-form__form-item" style={{ paddingTop: 5 }}
                                label={
                                    <div className="grocery-form__form-item-label">
                                        <TeamOutlined style={{ marginRight: 8 }} />
                                        <div>Thành viên</div>
                                    </div>
                                }>
                                <div className="grocery-form__members-container grocery-form__body-item-form">
                                    {listMembers ? listMembers.map(item =>

                                        <div key={item._id} className="grocery-form__member-item" onClick={(e) => { this.handleClickChooseMember(item._id) }}>
                                            <div className="grocery-form__avatar-container">
                                                {item._id === assignedMembersOfList
                                                    ? <Avatar src={item.mAvatar.image} className="grocery-form__avatar-checked" />
                                                    : <Avatar src={item.mAvatar.image} className="grocery-form__avatar" />
                                                }
                                                {item._id === assignedMembersOfList ? <CheckOutlined className="grocery-form__checked-icon" /> : null}
                                            </div>
                                            <div className="grocery-form__title-avatar">{item.mName}</div>
                                        </div>
                                    )
                                        : null}
                                </div>
                            </Form.Item>

                            {/* Show shopping categories to choose*/}
                            <Form.Item className="grocery-form__form-item" label={
                                <div className="grocery-form__form-item-label">
                                    <TeamOutlined style={{ marginRight: 8 }} />
                                    <div>Loại mua sắm</div>
                                </div>
                            }>
                                <div className="grocery-form__members-container grocery-form__body-item-form">
                                    {allGroceryTypes ? allGroceryTypes.map(item =>
                                        <div key={item._id} className="grocery-form__member-item" onClick={(e) => { this.handleClickChooseType(item._id) }}>
                                            <div className="grocery-form__avatar-container">
                                                {checkedGroceryType === item._id
                                                    ? <Avatar src={item.image} className="grocery-form__avatar-checked" />
                                                    : <Avatar src={item.image} className="grocery-form__avatar" />
                                                }
                                                {checkedGroceryType === item._id ? <CheckOutlined className="grocery-form__checked-icon" /> : null}
                                            </div>
                                            <div className="grocery-form__title-avatar">{item.name}</div>
                                        </div>

                                    )
                                        : null}
                                    <div className="grocery-form__member-item" onClick={(e) => { this.handleClickChooseType('add-grocery-type') }}>
                                        <div className="grocery-form__icon-add-container">
                                            <PlusOutlined className="grocery-form__icon-add" />
                                        </div>
                                        <div className="grocery-form__title-avatar">Thêm mới</div>
                                    </div>
                                </div>
                            </Form.Item>

                            {/* Set up time and repeat mode */}
                            <Form.Item className="grocery-form__form-item" label={
                                <div className="grocery-form__form-item-label">
                                    <RetweetOutlined style={{ marginRight: 8 }} />
                                    <div>Cài đặt thời gian</div>
                                </div>
                            }>
                                <Row justify="space-between" align="middle" className="grocery-form__body-item-form grocery-form__repeat">
                                    <Col xl={7} lg={8} sm={9} xs={6} style={{ fontSize: 14, color: 'black' }}>

                                        <div className="grocery-form__text-label">Tùy chọn lặp</div>
                                    </Col>
                                    <Col xl={17} lg={16} sm={15} xs={18} className="grocery-form__input">
                                        <Button className="grocery-form__btn-repeat"
                                            onClick={() => { this.clickToShowRepeatModal() }}>
                                            {repeatOfList ? textRepeat : 'Không lặp'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item className="grocery-form__form-item">
                                <Row style={{ width: '100%' }}>
                                    <Col xl={12} lg={12} md={12} xs={24}>
                                        <Form.Item className="grocery-form__form-item" style={{ paddingTop: 5 }}
                                            label={
                                                <div className="grocery-form__form-item-label">
                                                    <AppstoreAddOutlined style={{ marginRight: 8 }} />
                                                    <div>{isEditing ? 'Sửa vật phẩm' : 'Thêm vật phẩm'}</div>
                                                </div>
                                            }>
                                            <div className="grocery-form__add-item-container">
                                                <Row gutter={[20, 0]} style={{ width: '100%' }}>
                                                    <Col lg={24} xl={24} sm={24} xs={24}>
                                                        <Form.Item label="Tên vật phẩm">
                                                            <Input placeholder="Nhập tên vật phẩm..."
                                                                name="nameOfItem"
                                                                onChange={this.handleChangeInput}
                                                                value={nameOfItem}>
                                                            </Input>
                                                        </Form.Item>
                                                        <Form.Item label="Ghi chú vật phẩm">
                                                            <Input placeholder="Ghi chú vật phẩm: Số lượng, khối lượng,..."
                                                                name="noteOfItem"
                                                                onChange={this.handleChangeInput}
                                                                value={noteOfItem}>
                                                            </Input>
                                                        </Form.Item>

                                                    </Col>
                                                    <Col lg={24} xl={24} sm={24} xs={24}>
                                                        <Form.Item label="Hình ảnh vật phẩm:">
                                                            <div className="grocery-form__input-image">
                                                                {currentUrlImg !== "" && <img src={currentUrlImg} className="grocery-form__image-item" />}
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <div className=" upload-img-add-calendar-container" style={{ marginTop: currentUrlImg ? 5 : 0 }}>
                                                                        <div className="upload-img-ui-add-canlendar" >
                                                                            <UploadOutlined style={{ fontSize: 16 }} />
                                                                             &emsp;
                                                                            <span className={{ width: 'max-content' }} style={{ fontSize: 16 }}> {!currentUrlImg ? "Chọn ảnh" : "Thay đổi ảnh"} </span>
                                                                        </div>
                                                                        <input ref={this.inputFile} className="input-file-add-calendar" type="file" onChange={this.handleChangeImg} />
                                                                    </div>
                                                                    {currentUrlImg && <div className=" delete-img-button" onClick={this.handleClickDeleteImg}>Xóa ảnh</div>}
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Form.Item>
                                                            <Button disabled={!nameOfItem} type="primary" ghost onClick={() => { this.handleAddAItem() }}>{isEditing ? 'Lưu vật phẩm' : 'Thêm vật phẩm'}</Button>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} lg={12} md={12} xs={24}>
                                        <Form.Item className="grocery-form__form-item" style={{ paddingTop: 5 }}
                                            label={
                                                <div className="grocery-form__form-item-label">
                                                    <ShoppingCartOutlined style={{ marginRight: 8 }} />
                                                    <div>Danh sách vật phẩm</div>
                                                </div>
                                            }>
                                            <List
                                                pagination={{
                                                    pageSize: 5,
                                                    size: 'small'
                                                }}
                                                dataSource={listItemOfList}
                                                renderItem={(item, index) => (
                                                    <List.Item key={item.stt} className="grocery-form__item">
                                                        <div className="grocery-form__main-info-item">
                                                            <div className="grocery-form__info-item">
                                                                <div className="grocery-form__des-item">
                                                                    <div className="grocery-form__name-item">{index + 1}. {item.name}</div>
                                                                    <div className="grocery-form__note-item">{item.details}</div>
                                                                </div>

                                                                {item.photo ? <img src={item.photo} className="grocery-form__img"></img> : null}
                                                            </div>

                                                            <div className="grocery-from__action-item">
                                                                <div className="grocery-form__action" style={{ color: '#08979c' }} onClick={() => this.handleClickEditItem(item, index)}>
                                                                    <EditOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action" >Sửa</div>
                                                                </div>
                                                                <div className="grocery-form__action" style={{ color: '#EC6764' }} onClick={() => { this.handleDeleteItem(item) }}>
                                                                    <DeleteOutlined className="grocery__icon-action" />
                                                                    <div className="grocery__title-action">Xóa</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Form.Item>
                                    <div className="grocery-form__btn">
                                        <Button type="default" style={{ marginRight: '10px' }} onClick={this.handleClickBack}>Hủy</Button>
                                        <Button htmlType="submit" type="primary" loading={isLoading} disabled={!this.checkValidateForm().isValidated}>Thêm danh sách</Button>
                                    </div>
                                </Form.Item>
                            </Form.Item>


                        </Form>

                        <BasicRepeatModal handleClickCancelModalForParent={this.clickCancelRepeatModal} enableRepeatModal={enableRepeatModal} receiveDataRepeat={this.receiveDataRepeat}></BasicRepeatModal>
                    </Content>
                </Layout>
            </Layout>
        )
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
    getAllGroceryTypes: groceryTypeActions.getAllGroceryTypes,
    addNewGrocery: groceryActions.addGrocery,
    editGrocery: groceryActions.editGrocery
}

export default connect(mapStateToProps, actionCreators)(DataFormGrocery);