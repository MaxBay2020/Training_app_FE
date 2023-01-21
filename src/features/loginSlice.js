import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    accessToken: localStorage.getItem('accessToken') || '',

}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const { accessToken } = action.payload
            state.accessToken = accessToken
            localStorage.setItem('accessToken', accessToken)
        },
        userLogout: (state, _action) => {
            state.accessToken = ''
            localStorage.removeItem('accessToken')
        }

    }

})

export default loginSlice.reducer

export const {
    userLogin,
    userLogout
} = loginSlice.actions
