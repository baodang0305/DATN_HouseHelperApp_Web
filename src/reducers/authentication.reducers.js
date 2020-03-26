import { memberConstants } from "../constants/member.constants";

let user = JSON.parse(localStorage.getItem("user"));
const initiateState = user ? { loggedIn: true, user} : {};
function authentication(state = initiateState, action) {
    switch(action.type) {
        case memberConstants.LOGIN_REQUEST: {
            return {
                loggingIn: true
            }
        }
        case memberConstants.LOGIN_SUCCESS: {
            return {
                loggedIn: true,
                user: action.user
            }
        }
        case memberConstants.LOGIN_FAILURE: {
            return {}
        }
        default: return state;
    }
}

export default authentication;