import { USER_TYPES } from "./user.type";

const INITIAL_STATE = {
    currentUser: null,
    services: [],
    system_rates: {},
    banks: null,
    biometric: true,
    products: [],
    ads: [],
    finger_enabled: false
}


const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case USER_TYPES.CURRENT_USER: 
            return {
                ...state,
                currentUser: action.payload
            }
        case USER_TYPES.SET_SERVICES: 
            return {
                ...state,
                services: action.payload
            }
        case USER_TYPES.SYSTEM_RATES: 
            return {
                ...state,
                system_rates: action.payload
            }
        case USER_TYPES.SYSTEM_BANKS: 
            return {
                ...state,
                banks: action.payload
            }
        case USER_TYPES.BIOMETRIC: 
            return {
                ...state,
                biometric: action.payload
            }
        case USER_TYPES.PRODUCT: 
            return {
                ...state,
                products: action.payload
            }
        case USER_TYPES.ADS: 
            return {
                ...state,
                ads: action.payload
            }
        case USER_TYPES.FINGER_PRINT:
                return {
                    ...state,
                    finger_enabled: action.payload
                }
        default : return state
    }
}


export default userReducer