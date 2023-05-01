import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    accessToken: localStorage.getItem('accessToken') || '',
    userName: localStorage.getItem('userName') || '',
    userRole: localStorage.getItem('userRole') || '',
    userEmail:localStorage.getItem('userEmail') || '',
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
                userRole,
                userEmail,
                servicerId,
                servicerMasterName
            } = action.payload
            state.accessToken = accessToken
            state.userName = userName
            state.userRole = userRole
            state.userEmail = userEmail
            state.servicerId = servicerId
            state.servicerMasterName = servicerMasterName
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('userName', userName)
            localStorage.setItem('userRole', userRole)
            localStorage.setItem('userEmail', userEmail)
            localStorage.setItem('servicerId', servicerId)
            localStorage.setItem('servicerMasterName', servicerMasterName)

        },
        userLogout: (state, _action) => {
            state.accessToken = ''
            state.userName = ''
            state.userRole = ''
            state.userEmail = ''
            state.servicerId = ''
            state.servicerMasterName = ''
            localStorage.removeItem('accessToken')
            localStorage.removeItem('userName')
            localStorage.removeItem('userRole')
            localStorage.removeItem('userEmail')
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
