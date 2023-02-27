import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    accessToken: localStorage.getItem('accessToken') || '',
    userName: localStorage.getItem('userName') || '',
    servicerId: localStorage.getItem('servicerId') || '',
    servicerMasterName: localStorage.getItem('servicerMasterName') || '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const {
                accessToken,
                userName,
                servicerId,
                servicerMasterName
            } = action.payload
            state.accessToken = accessToken
            state.userName = userName
            state.servicerId = servicerId
            state.servicerMasterName = servicerMasterName
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('userName', userName)
            localStorage.setItem('servicerId', servicerId)
            localStorage.setItem('servicerMasterName', servicerMasterName)

        },
        userLogout: (state, _action) => {
            state.accessToken = ''
            state.userName = ''
            state.servicerId = ''
            state.servicerMasterName = ''
            localStorage.removeItem('accessToken')
            localStorage.removeItem('userName')
            localStorage.removeItem('servicerId')
            localStorage.removeItem('servicerMasterName')
        }

    }

})

export default userSlice.reducer

export const {
    userLogin,
    userLogout
} = userSlice.actions
