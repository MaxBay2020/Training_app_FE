import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import trainingReducer from '../features/trainingSlice'
import usersManagementReducer from '../features/usersManagementSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        training: trainingReducer,
        usersManagement: usersManagementReducer
    }
})

export default store
