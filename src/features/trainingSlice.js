import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentTraining: null,
    openModal: false,
    uploadedTrainings: [],
    duplicates: []
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
        },
        addDuplicates: (state, action) => {
            state.duplicates = action.payload
        }
    }
})

export default trainingSlice.reducer
export const {
    setCurrentTraining,
    switchOpenModal,
    addUploadedTrainings,
    addDuplicates,

} = trainingSlice.actions

