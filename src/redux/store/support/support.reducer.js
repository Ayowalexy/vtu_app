import { SUPPORT_TYPE } from "./support.types";

const INITIAL_STATE = {
    tickets: []
}


const ticketsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case SUPPORT_TYPE.GET_ALL_TICKETS:
            return {
                ...state,
                tickets: action.payload
            }
        default: return state
    }
}


export default ticketsReducer