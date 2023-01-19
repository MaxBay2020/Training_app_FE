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
        userLogout: (state, _action) => {
            state.email = ''
            localStorage.removeItem('userEmail')
        }

    }

})

export default loginSlice.reducer

export const {
    userLogin,
    userLogout
} = loginSlice.actions
