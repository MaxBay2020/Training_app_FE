import {configureStore} from '@reduxjs/toolkit'
import loginReducer from '../features/userSlice'
import trainingReducer from '../features/trainingSlice'

const store = configureStore({
    reducer: {
        user: loginReducer,
        training: trainingReducer
    }
})

export default store
