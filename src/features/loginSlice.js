import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    email: '',

}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const {email} = action.payload
            state.email = email
        },

    }

})

export default loginSlice.reducer

export const {
    userLogin
} = loginSlice.actions
