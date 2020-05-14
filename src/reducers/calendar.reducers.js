import { calendarConstants } from "../constants/calendar.constants";

const calendar = (state = {}, action) => {
    switch(action.type) {

        // add event
        case calendarConstants.ADD_EVENT_REQUEST: {
            return { ...state, addingEvent: true, addedEvent: false }
        }
        case calendarConstants.ADD_EVENT_SUCCESS: {
            return { ...state, addingEvent: false, addedEvent: true }
        }
        case calendarConstants.ADD_EVENT_FAILURE: { 
            return { ...state, addingEvent: false, addedEvent: true }
        }

        // get list events
        case calendarConstants.GET_LIST_EVENTS_REQUEST: {
            return { ...state, gettingListEvents: true, gotListEvents: false }
        }
        case calendarConstants.GET_LIST_EVENTS_SUCCESS: {
            return { ...state, gettingListEvents: false, gotListEvents: true, listCalendar: action.listCalendar }
        }
        case calendarConstants.GET_LIST_EVENTS_FAILURE: {
            return { ...state, gettingListEvents: false, gotListEvents: true }
        }

        // edit event
        case calendarConstants.EDIT_EVENT_REQUEST: {
            return { ...state, edittingEvent: true, editedEvent: false }
        }
        case calendarConstants.EDIT_EVENT_SUCCESS: {
            return { ...state, edittingEvent: false, editedEvent: true }
        }
        case calendarConstants.EDIT_EVENT_FAILURE: {
            return { ...state, edittingEvent: false, editedEvent: true }
        }
        
        // delete event
        case calendarConstants.DELETE_EVENT_REQUEST: {
            return { ...state, deletingEvent: true, deletedEvent: false }
        }
        case calendarConstants.DELETE_EVENT_SUCCESS: {
            return { ...state, deletingEvent: false, deletedEvent: true }
        }
        case calendarConstants.DELETE_EVENT_FAILURE: {
            return { ...state, deletingEvent: false, deletedEvent: true }
        }

        // start remind event notification
        case calendarConstants.START_REMIND_EVENT_NOTIFICATION: {
            return { ...state, remindingEventNotification: true, remindedEventNotification: false }
        }

        // stop remind event notification
        case calendarConstants.STOP_REMIND_EVENT_NOTIFICATION: {
            return { ...state, remindedEventNotification: true, remindingEventNotification: false }
        }

        //default
        default: return state;
    }
}

export default calendar;