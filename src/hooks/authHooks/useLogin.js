import api from "../../api/api"
import {useMutation} from "@tanstack/react-query"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom'
import {useDispatch} from "react-redux";
import {userLogin} from "../../features/userSlice";


const useLogin = (queryIdentifier) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loginUser = async (reqBody) => {
        const res = await api.post('/auth/login', reqBody)
        const {
            accessToken,
            userRole,
            userName,
            servicerId,
            servicerMasterName
        } = res.data
        dispatch(userLogin({
            accessToken,
            userName,
            userRole,
            servicerId,
            servicerMasterName
        }))
    }

    return useMutation(queryIdentifier, loginUser, {
        onError: (e) => {
            toast.error('Email or password NOT correct')
        }
    })
}

export default useLogin
