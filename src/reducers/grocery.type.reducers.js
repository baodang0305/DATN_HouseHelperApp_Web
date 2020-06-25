import { groceryTypeConstants } from '../constants/grocery.type.constants';


function groceryType(state = { allGroceryTypes: [], loading: false }, actions) {
    switch (actions.type) {
        case groceryTypeConstants.groceryTypeRequest.GROCERY_TYPE_REQUEST: {
            return { ...state, loadingGroceryType: true }
        }
        case groceryTypeConstants.getAllGroceryTypes.GET_ALL_GROCERY_TYPE_SUCCESS: {
            return { ...state, loadingGroceryType: false, allGroceryTypes: actions.allGroceryTypes }
        }

        case groceryTypeConstants.addGroceryType.ADD_GROCERY_TYPE_SUCCESS: {
            return { ...state, loadingGroceryType: false }
        }

        case groceryTypeConstants.editGroceryType.EDIT_GROCERY_TYPE_SUCCESS: {
            return { ...state, loadingGroceryType: false, allGroceryTypes: actions.allGroceryTypes }
        }

        case groceryTypeConstants.deleteGroceryType.DELETE_GROCERY_TYPE_SUCCESS: {
            return { ...state, loadingGroceryType: false, allGroceryTypes: actions.allGroceryTypes }
        }
        case groceryTypeConstants.groceryTypeFailure.GROCERY_TYPE_FAILURE: {
            return { ...state, loadingGroceryType: false }
        }
        default: {
            return { ...state }
        }
    }
}
export default groceryType;