import { memberConstants } from "../constants/member.constants";
import { familyConstants } from "../constants/family.constants";

function family(state = {}, action) {

    switch (action.type) {

        case familyConstants.CREATE_FAMILY_REQUEST: {
            return { ...state, creating: true, created: false }
        }

        case familyConstants.CREATE_FAMILY_SUCCESS: {
            return { ...state, created: true, creating: false }
        }

        case familyConstants.CREATE_FAMILY_FAILURE: {
            return { ...state, created: true, creating: false }
        }

        case familyConstants.ACTIVE_ACCOUNT_REQUEST: {
            return { ...state, activating: true, activated: false }
        }

        case familyConstants.ACTIVE_ACCOUNT_SUCCESS: {
            return { ...state, activated: true, activating: false }
        }

        case familyConstants.ACTIVE_ACCOUNT_FAILURE: {
            return { ...state, activated: true, activating: false }
        }

        case memberConstants.RESET_PASSWORD_REQUEST: {
            return { ...state, resetting: true, resetted: false }
        }

        case memberConstants.RESET_PASSWORD_SUCCESS: {
            return { ...state, resetted: true, resetting: false }
        }

        case memberConstants.RESET_PASSWORD_FAILURE: {
            return { ...state, resetted: true, resetting: false }
        }

        case memberConstants.ADD_MEMBER_REQUEST: {
            return { ...state, addingMember: true, addedMember: false }
        }

        case memberConstants.ADD_MEMBER_SUCCESS: {
            return { ...state, addedMember: true, addingMember: false }
        }

        case memberConstants.ADD_MEMBER_FAILURE: {
            return { ...state, addedMember: true, addingMember: false }
        }

        case memberConstants.CHANGE_PASSWORD_REQUEST: {
            return { ...state, changingPassword: true, changedPassword: false }
        }

        case memberConstants.CHANGE_PASSWORD_SUCCESS: {
            return { ...state, changedPassword: true, changingPassword: false }
        }

        case memberConstants.CHANGE_PASSWORD_FAILURE: {
            return { ...state, changedPassword: true, changingPassword: false }
        }

        case familyConstants.CHANGE_FAMILY_PASSWORD_REQUEST: {
            return { ...state, changingFamilyPassword: true, changedFamilyPassword: false }
        }

        case familyConstants.CHANGE_FAMILY_PASSWORD_SUCCESS: {
            return { ...state, changedFamilyPassword: true, changingFamilyPassword: false }
        }

        case familyConstants.CHANGE_FAMILY_PASSWORD_FAILURE: {
            return { ...state, changedFamilyPassword: true, changingFamilyPassword: false }
        }

        case familyConstants.GET_LIST_NEWS_REQUEST: {
            return { ...state, gettingListNews: true, gotListNews: false }
        }

        case familyConstants.GET_LIST_NEWS_SUCCESS: {
            return { ...state, gettingListNews: false, gotListNews: true, listNews: action.listNews }
        }

        case familyConstants.GET_LIST_NEWS_FAILURE: {
            return { ...state, gettingListNews: false, gotListNews: true }
        }

        case familyConstants.GET_LIST_MEMBERS_REQUEST: {
            return { ...state, gettingListMembers: true, gotListMembers: false }
        }

        case familyConstants.GET_LIST_MEMBERS_FAILURE: {
            return { ...state, gettingListMembers: false, gotListMembers: true }
        }

        case familyConstants.GET_LIST_MEMBERS_SUCCESS: {
            return { ...state, gettingListMembers: false, gotListMembers: true, listMembers: action.listMembers }
        }

        default: return state;

    }
}

export default family;