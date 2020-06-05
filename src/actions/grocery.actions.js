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

export const groceryActions = {
    getAllGroceries,
}