import { groceryConstants } from '../constants/grocery.constants';
import { groceryActions } from '../actions/grocery.actions'

const initialState = { allGroceries: [] };

function grocery(state = initialState, action) {
    switch (action.type) {
        case groceryConstants.getAllGrocery.GET_ALL_GROCERY_REQUEST: {
            return { ...state, loadingGrocery: true }
        }
        case groceryConstants.getAllGrocery.GET_ALL_GROCERY_SUCCESS: {
            return { ...state, loadingGrocery: false, allGroceries: action.allGroceries }
        }
        case groceryConstants.getAllGrocery.GET_ALL_GROCERY_FAILURE: {
            return { ...state, loadingGrocery: false }
        }
        default: return state
    }
}

export default grocery;