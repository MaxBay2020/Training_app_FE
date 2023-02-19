import {configureStore} from '@reduxjs/toolkit'
import loginReducer from '../features/loginSlice'
import trainingReducer from '../features/trainingSlice'

const store = configureStore({
    reducer: {
        login: loginReducer,
        training: trainingReducer
    }
})

export default store
