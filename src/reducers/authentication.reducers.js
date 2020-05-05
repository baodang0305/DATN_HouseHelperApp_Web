import { memberConstants } from "../constants/member.constants";

let inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
const initiateState = inforLogin ? { loggedIn: true, inforLogin } : { loggingIn: false, inforLogin: { token: 'null' } };

function authentication(state = initiateState, action) {
    switch (action.type) {
        case memberConstants.LOGIN_REQUEST: {
            return { ...state, loggingIn: true }
        }
        case memberConstants.LOGIN_SUCCESS: {
            return { ...state, loggedIn: true, inforLogin: action.inforLogin }
        }
        case memberConstants.LOGIN_FAILURE: {
            return { loggingIn: false, inforLogin: { token: 'null' } };
        }
        case memberConstants.LOGOUT: {
            return { loggingIn: false, inforLogin: { token: 'null' } };
        }
        default: return state;
    }
}

export default authentication;