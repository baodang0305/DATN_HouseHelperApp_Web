import { memberConstants } from "../constants/member.constants";

const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
const initiateState = inforLogin ? { loggedIn: true, inforLogin} : {};

function authentication(state = initiateState, action) {
    switch(action.type) {
        case memberConstants.LOGIN_REQUEST: {
            return { ...state, loggingIn: true }
        }
        case memberConstants.LOGIN_SUCCESS: {
            return { ...state, loggedIn: true, inforLogin: action.inforLogin }
        }
        case memberConstants.LOGIN_FAILURE: {
            return {};
        }
        case memberConstants.LOGOUT: {
            return {};
        }
        default: return state;
    }
}

export default authentication;