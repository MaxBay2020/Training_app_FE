import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null
}

export const usersManagementSlice = createSlice({
    initialState,
    name: 'usersManagement',
    reducers: {
        setCurrentUser: (state, action) => {
            const { currentUser } = action.payload
            state.currentUser = currentUser
        }
    }

})

export default usersManagementSlice.reducer
export const {
    setCurrentUser
} = usersManagementSlice.actions
