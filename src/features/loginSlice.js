import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    email: localStorage.getItem('userEmail') || '',

}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const {email} = action.payload
            state.email = email
            localStorage.setItem('userEmail', email)
        },

    }

})

export default loginSlice.reducer

export const {
    userLogin
} = loginSlice.actions
