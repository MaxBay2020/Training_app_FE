import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentServicer: null,
    duplicates: []
}

export const servicersManagementSlice = createSlice({
    initialState,
    name: 'servicersManagement',
    reducers: {
        setCurrentServicer: (state, action) => {
            const { currentServicer } = action.payload
            state.currentServicer = currentServicer
        },
        resetCurrentServicer: (state, _action) => {
            state.currentServicer = null
        },
        addDuplicates: (state, action) => {
            state.duplicates = action.payload
        }
    }

})

export default servicersManagementSlice.reducer
export const {
    setCurrentServicer,
    resetCurrentServicer,
    addDuplicates,

} = servicersManagementSlice.actions
