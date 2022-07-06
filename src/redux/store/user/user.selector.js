import { createSelector } from "reselect";


const selectUser = state => state.user

export const selectUserVerificationState = createSelector(
    [selectUser],
    ({currentUser}) => {
        return {
            account_status: currentUser?.account_status,
            transaction_pin: currentUser?.transaction_pin
        }
    }
)

export const selectCurrentUser = createSelector(
    [selectUser],
    (user) => user.currentUser
)


export const selectServices = createSelector(
    [selectUser],
    (user) => user.services
)


export const selectSystemRates = createSelector(
    [selectUser],
    (user) => user.system_rates
)

export const selectSystemBanks = createSelector(
    [selectUser], 
    (user) => user.banks
)

export const selectBiometricState = createSelector(
    [selectUser], 
    (user) => user
)


export const selectAllAds = createSelector(
    [selectUser],
    (user) => user.ads
)

export const selectFingerprint = createSelector(
    [selectUser],
    (user) => user.finger_enabled
)