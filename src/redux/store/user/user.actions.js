import { USER_TYPES } from "./user.type";
import { createAction } from "../../utils";
import { signUp, getUserProfile, getAllAds, getAllServices, getSettings, getSystemBanks, getCables } from "../../../services/network";


export const setCurrentUser = (data) =>
    createAction(USER_TYPES.CURRENT_USER, data)

export const setServices = (data) => 
    createAction(USER_TYPES.SET_SERVICES, data)

export const setProducts = (data) =>
    createAction(USER_TYPES.PRODUCT, data)

export const setRates = (data) => 
    createAction(USER_TYPES.SYSTEM_RATES, data)

export const setBanks = (data) => 
    createAction(USER_TYPES.SYSTEM_BANKS, data)

export const setBiometrics = (data) => 
    createAction(USER_TYPES.BIOMETRIC, data)

export const setAllAds = (data) =>
    createAction(USER_TYPES.ADS, data)

export const setFingerprint = (data) =>
    createAction(USER_TYPES.FINGER_PRINT, data)

export const setCurrentUserUserActionAsync = (data) => {
    return async (dispatch) => {
        try {
            const response = await getUserProfile()
            if(response.status == 200){
                const customer = response?.data?.customer
                dispatch(setCurrentUser(customer))
            }
            
        } catch(e){
            console.log(e)
        }
    }
}


export const setLoginActionAsync = (data) => {
    return async (dispatch) => {
        try {
            const response = await getAllServices();
            const rates = await getSettings();
            const banks = await getSystemBanks()
            const ads = await getAllAds();
            
            
            if(response?.status == 200){
                const services = response?.data;
                dispatch(setServices(services))
                dispatch(setRates(rates?.data))
                dispatch(setBanks(banks?.data?.result))
                dispatch(setAllAds(ads?.data))
                // dispatch(setFingerprint(false))
            }
        } catch (e) {
            console.log(e)
        }
    }
}
