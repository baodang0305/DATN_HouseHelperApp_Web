import { memberConstants } from "../constants/member.constants";
import { familyConstants } from "../constants/family.constants";

function family(state = {}, action) {
    switch (action.type) {
        case familyConstants.CREATE_FAMILY_SUCCESS: {
            return { message: action.message }
        }
        case familyConstants.CREATE_FAMILY_FAILURE: { 
            return { message: action.message }
        }
        case memberConstants.GET_ALL_MEMBERS: {
            return { members: action.members }
        }
        default: return state;
    }
}

export default family;