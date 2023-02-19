import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentTraining: null,
    openModal: false
}

const trainingSlice = createSlice({
    name: 'training',
    initialState,
    reducers: {
        setCurrentTraining: (state, action) => {
            const { training } = action.payload
            state.currentTraining = training
        },
        switchOpenModal: (state, action) => {
            state.openModal = !state.openModal
            if(!state.openModal){
                state.currentTraining = null
            }
        },
    }
})

export default trainingSlice.reducer
export const {
    setCurrentTraining,
    switchOpenModal
} = trainingSlice.actions

