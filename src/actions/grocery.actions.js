import apiUrlTypes from "../helpers/apiURL";
import { groceryConstants } from '../constants/grocery.constants';
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";
import axios from 'axios';

const getAllGroceries = () => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.get(`${apiUrlTypes.heroku}/list-shopping-list`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success(res.data.shoppingLists));
                }
                else {
                    dispatch(alertActions.error(message));
                    dispatch(failure());
                }
            }
            )
    }
    function request() { return { type: groceryConstants.getAllGrocery.GET_ALL_GROCERY_REQUEST } }
    function success(allGroceries) { return { type: groceryConstants.getAllGrocery.GET_ALL_GROCERY_SUCCESS, allGroceries } }
    function failure() { return { type: groceryConstants.getAllGrocery.GET_ALL_GROCERY_FAILURE } }
}

const addGrocery = (name, assign, stID, repeat, listItems) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/add-shopping-list', { name, assign, stID, repeat, listItems }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-list', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.shoppingLists));
                            dispatch(alertActions.success(message));
                            history.push("/grocery");
                        })
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryConstants.addGrocery.ADD_GROCERY_REQUEST } }
    function success(allGroceries) {
        return { type: groceryConstants.addGrocery.ADD_GROCERY_SUCCESS, allGroceries }
    }
    function failure() { return { type: groceryConstants.addGrocery.ADD_GROCERY_FAILURE } }
}

const editGrocery = (slID, name, stID, assign, repeat, listItems, total, bill) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/edit-shopping-list', { slID, name, stID, assign, repeat, listItems, total, bill }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-list', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.shoppingLists));
                            dispatch(alertActions.success(message));
                            history.push("/grocery");
                        })
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryConstants.editGrocery.EDIT_GROCERY_REQUEST } }
    function success(allGroceries) {
        return { type: groceryConstants.editGrocery.EDIT_GROCERY_SUCCESS, allGroceries }
    }
    function failure() { return { type: groceryConstants.editGrocery.EDIT_GROCERY_FAILURE } }
}

const deleteGrocery = (slID) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/delete-shopping-list', { slID }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-list', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.shoppingLists));
                            dispatch(alertActions.success(message));
                            history.push("/grocery");
                        })
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryConstants.deleteGrocery.DELETE_GROCERY_REQUEST } }
    function success(allGroceries) {
        return { type: groceryConstants.deleteGrocery.DELETE_GROCERY_SUCCESS, allGroceries }
    }
    function failure() { return { type: groceryConstants.deleteGrocery.DELETE_GROCERY_FAILURE } }
}

const checkBoughtItem = (slID, islID) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/check-bought', { slID, islID }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-list', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.shoppingLists));
                            dispatch(alertActions.success(message));
                            history.push("/grocery");
                        })
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryConstants.checkBoughtItem.CHECK_BOUGHT_ITEM_REQUEST } }
    function success(allGroceries) {
        return { type: groceryConstants.checkBoughtItem.CHECK_BOUGHT_ITEM_SUCCESS, allGroceries }
    }
    function failure() { return { type: groceryConstants.checkBoughtItem.CHECK_BOUGHT_ITEM_FAILURE } }
}

const assignGrocery = (slID) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/assign-shopping-list', { slID }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-shopping-list', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.shoppingLists));
                            dispatch(alertActions.success(message));
                            history.push("/grocery");
                        })
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: groceryConstants.assignGrocery.ASSIGN_GROCERY_REQUEST } }
    function success(allGroceries) {
        return { type: groceryConstants.assignGrocery.ASSIGN_GROCERY_SUCCESS, allGroceries }
    }
    function failure() { return { type: groceryConstants.assignGrocery.ASSIGN_GROCERY_FAILURE } }
}

export const groceryActions = {
    getAllGroceries,
    addGrocery,
    editGrocery,
    deleteGrocery,
    checkBoughtItem,
    assignGrocery
}