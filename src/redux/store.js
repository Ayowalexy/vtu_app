import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { persistStore } from 'redux-persist'

import rootReducer from './rootReducer'
import { log } from 'react-native-reanimated'

const middlewares = [thunk]
// const middlewares = []

const store = createStore(rootReducer, applyMiddleware(...middlewares))

const persistor = persistStore(store);

export { store, persistor }