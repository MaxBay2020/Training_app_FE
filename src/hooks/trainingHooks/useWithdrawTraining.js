import api from "../../api/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDispatch, useSelector} from "react-redux";
import { toast } from 'react-toastify'
import {useNavigate} from "react-router-dom";
import {userLogout} from "../../features/loginSlice";



const useWithdrawTraining = () => {

    const queryClient = useQueryClient()
    const { accessToken } = useSelector( state => state.login )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const withdrawTraining = async ({ trainingId }) => {
        await api.delete(`training/${trainingId}`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
    }
    return useMutation(withdrawTraining, {
        onSuccess: () => {
            toast.success('Withdrawn Successfully')
            queryClient.invalidateQueries(['queryAllTrainings'])
        },
        onError: (e) => {
            const statusCode = e.response.status
            if(statusCode === 402){
                dispatch(userLogout())
                navigate('/authentication')
            }
            const { message } = e.response.data
            toast.error(message)
        }
    })
}

export default useWithdrawTraining
