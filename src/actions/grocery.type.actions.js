import apiUrlTypes from "../helpers/apiURL";

import { groceryTypeConstants } from "../constants/grocery.type.constants";
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";
import axios from 'axios';

const getAllGroceryTypes = () => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.get(
            'https://househelperapp-api.herokuapp.com/list-shopping-type', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success(res.data.listShoppingTypes))
                }
                else {
                    dispatch(alertActions.error(message));
                    dispatch(failure())
                }
            }

            )

    }
    function request() { return { type: groceryTypeConstants.groceryTypeRequest.GROCERY_TYPE_REQUEST } }
    function success(allGroceryTypes) {
        return { type: groceryTypeConstants.getAllGroceryTypes.GET_ALL_GROCERY_TYPE_SUCCESS, allGroceryTypes }
    }
    function failure() { return { type: groceryTypeConstants.groceryTypeFailure.GROCERY_TYPE_FAILURE } }
}

const addGroceryType = (name, image) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/add-shopping-type', { name, image }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success());
                    dispatch(alertActions.success(message));
                    history.push("/grocery");
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryTypeConstants.groceryTypeRequest.GROCERY_TYPE_REQUEST } }
    function success() {
        return { type: groceryTypeConstants.addGroceryType.ADD_GROCERY_TYPE_SUCCESS }
    }
    function failure() { return { type: groceryTypeConstants.groceryTypeFailure.GROCERY_TYPE_FAILURE } }
}

const editGroceryType = (stID, name, image) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/edit-shopping-type', { stID, name, image }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-type', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.listShoppingTypes));
                            dispatch(alertActions.success(message));
                            history.push("/task-category");
                        })

                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryTypeConstants.groceryTypeRequest.GROCERY_TYPE_REQUEST } }
    function success(allGroceryTypes) {
        return { type: groceryTypeConstants.editGroceryType.EDIT_GROCERY_TYPE_SUCCESS, allGroceryTypes }
    }
    function failure() { return { type: groceryTypeConstants.groceryTypeFailure.GROCERY_TYPE_FAILURE } }
}


const deleteGroceryType = (stIDDelete, stIDReplace) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/delete-shopping-type', { stIDDelete, stIDReplace }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-type', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.listShoppingTypes));
                            dispatch(alertActions.success(message));
                        })

                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryTypeConstants.groceryTypeRequest.GROCERY_TYPE_REQUEST } }
    function success(allGroceryTypes) {
        return { type: groceryTypeConstants.deleteGroceryType.DELETE_GROCERY_TYPE_SUCCESS, allGroceryTypes }
    }
    function failure() { return { type: groceryTypeConstants.groceryTypeFailure.GROCERY_TYPE_FAILURE } }
}

export const groceryTypeActions = {
    getAllGroceryTypes,
    addGroceryType,
    editGroceryType,
    deleteGroceryType
}