import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import trainingReducer from '../features/trainingSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        training: trainingReducer
    }
})

export default store
