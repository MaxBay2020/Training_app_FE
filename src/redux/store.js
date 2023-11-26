import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/userSlice'
import trainingReducer from '../features/trainingSlice'
import usersManagementReducer from '../features/usersManagementSlice'
import servicersManagementReducer from "../features/servicersManagementSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        training: trainingReducer,
        usersManagement: usersManagementReducer,
        servicersManagement: servicersManagementReducer,
    }
})

export default store
