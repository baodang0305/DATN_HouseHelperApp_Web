import { groceryConstants } from '../constants/grocery.constants';

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

        // add new grocery reduce
        case groceryConstants.addGrocery.ADD_GROCERY_REQUEST: {
            return { ...state, loadingGrocery: true }
        }
        case groceryConstants.addGrocery.ADD_GROCERY_SUCCESS: {
            return { ...state, loadingGrocery: false, allGroceries: action.allGroceries }
        }
        case groceryConstants.addGrocery.ADD_GROCERY_FAILURE: {
            return { ...state, loadingGrocery: false }
        }

        // edit a grocery reduce
        case groceryConstants.editGrocery.EDIT_GROCERY_REQUEST: {
            return { ...state, loadingGrocery: true }
        }
        case groceryConstants.editGrocery.EDIT_GROCERY_SUCCESS: {
            return { ...state, loadingGrocery: false, allGroceries: action.allGroceries }
        }
        case groceryConstants.editGrocery.EDIT_GROCERY_FAILURE: {
            return { ...state, loadingGrocery: false }
        }
        // delete a grocery reduce

        case groceryConstants.deleteGrocery.DELETE_GROCERY_REQUEST: {
            return { ...state, loadingGrocery: true }
        }
        case groceryConstants.deleteGrocery.DELETE_GROCERY_SUCCESS: {
            return { ...state, loadingGrocery: false, allGroceries: action.allGroceries }
        }
        case groceryConstants.deleteGrocery.DELETE_GROCERY_FAILURE: {
            return { ...state, loadingGrocery: false }
        }

        //Check bought a item 
        case groceryConstants.checkBoughtItem.CHECK_BOUGHT_ITEM_REQUEST: {
            return { ...state, loadingCheckBought: true }
        }
        case groceryConstants.checkBoughtItem.CHECK_BOUGHT_ITEM_SUCCESS: {
            return { ...state, loadingCheckBought: false, allGroceries: action.allGroceries }
        }
        case groceryConstants.checkBoughtItem.CHECK_BOUGHT_ITEM_FAILURE: {
            return { ...state, loadingCheckBought: false }
        }

        //Assign into a grocery
        case groceryConstants.assignGrocery.ASSIGN_GROCERY_REQUEST: {
            return { ...state, loadingGrocery: true }
        }
        case groceryConstants.assignGrocery.ASSIGN_GROCERY_SUCCESS: {
            return { ...state, loadingGrocery: false, allGroceries: action.allGroceries }
        }
        case groceryConstants.assignGrocery.ASSIGN_GROCERY_FAILURE: {
            return { ...state, loadingGrocery: false }
        }
        default: return state
    }
}

export default grocery;