import actionTypes from "../constants/actionTypes";

const members = (state = {}, action) => {
    switch(action.type) {
        case actionTypes.RECEIVED_MEMBERS: {
            return Object.assign({}, state, {
                members: action.members
            });
        }
        default: return state;
    }
}

export default members;