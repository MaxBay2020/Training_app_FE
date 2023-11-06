import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentTraining: null,
    openModal: false,
    uploadedTrainings: []
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
        addUploadedTrainings: (state, action) => {
            const { uploadedTrainings } = action.payload
            state.uploadedTrainings = uploadedTrainings
        }
    }
})

export default trainingSlice.reducer
export const {
    setCurrentTraining,
    switchOpenModal,
    addUploadedTrainings,

} = trainingSlice.actions

