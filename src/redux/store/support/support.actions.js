import { createAction } from "../../utils";
import { SUPPORT_TYPE } from "./support.types";
import { getAllFAQsAndFetchOne } from "../../../services/network";


export const setAllTickets = (data) => 
    createAction(SUPPORT_TYPE.GET_ALL_TICKETS, data)


export const setAllTicketsActionsAsync = () => {
    return async(dispatch) => {
        try {
            const tickets = await getAllFAQsAndFetchOne({type: 'parents'})
            if(tickets?.status == 200 && tickets?.data?.length){
                dispatch(setAllTickets(tickets?.data))
            }
        } catch(e){
            console.log(e)
        }
    }
}

