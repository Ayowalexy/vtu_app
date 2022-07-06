import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './store/user/user.reducer';
import ticketsReducer from './store/support/support.reducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["user"]
}


const rootReducer =  combineReducers({
    user: userReducer,
    support: ticketsReducer
})



export default persistReducer(persistConfig, rootReducer)