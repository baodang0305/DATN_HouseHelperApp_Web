import { memberConstants } from "../constants/member.constants";
import { familyConstants } from "../constants/family.constants";

function family(state = { allMembers: [] }, action) {
    switch (action.type) {
        case familyConstants.CREATE_FAMILY_SUCCESS: {
            return { ...state, message: action.message }
        }
        case familyConstants.CREATE_FAMILY_FAILURE: {
            return { ...state, message: action.message }
        }
        case memberConstants.GET_ALL_MEMBERS: {
            return { ...state, members: action.members }
        }

        case memberConstants.getAllMembers.GET_ALL_MEMBERS_REQUEST: {
            return { ...state, loading: true }
        }

        case memberConstants.getAllMembers.GET_ALL_MEMBERS_SUCCESS: {
            return { ...state, allMembers: action.allMembers, loading: false }
        }
        default: return state;
    }
}

export default family;