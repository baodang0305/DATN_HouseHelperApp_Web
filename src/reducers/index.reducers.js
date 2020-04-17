import { indexConstants } from "../constants/index.constants";

function index( state = {}, action) {
    switch(action.type) {
        case indexConstants.GET_LIST_TASKS: {
            return { ...state, listTasks: action.listTasks }
        }
        case indexConstants.NUMBER_OF_INCOMING_MESSAGES: {
            return { ...state, numberOfIncomingMessages: action.number}
        }
        default: return state;
    }
}

export default index;