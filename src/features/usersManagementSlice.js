import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    duplicates: []
}

export const usersManagementSlice = createSlice({
    initialState,
    name: 'usersManagement',
    reducers: {
        setCurrentUser: (state, action) => {
            const { currentUser } = action.payload
            state.currentUser = currentUser
        },
        resetCurrentUser: (state, _action) => {
            state.currentUser = null
        },
        addDuplicates: (state, action) => {
            state.duplicates = action.payload
        }
    }

})

export default usersManagementSlice.reducer
export const {
    setCurrentUser,
    resetCurrentUser,
    addDuplicates,

} = usersManagementSlice.actions
