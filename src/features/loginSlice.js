import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    accessToken: localStorage.getItem('accessToken') || '',
    name: localStorage.getItem('name') || '',
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const { accessToken, firstName } = action.payload
            state.accessToken = accessToken
            state.name = firstName
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('name', firstName)
        },
        userLogout: (state, _action) => {
            state.accessToken = ''
            state.name = ''
            localStorage.removeItem('accessToken')
            localStorage.removeItem('name')
        }

    }

})

export default loginSlice.reducer

export const {
    userLogin,
    userLogout
} = loginSlice.actions
