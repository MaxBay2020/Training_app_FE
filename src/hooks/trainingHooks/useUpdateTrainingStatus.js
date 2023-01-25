import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {userLogout} from "../../features/loginSlice";
import api from "../../api/api";
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

const useUpdateTrainingStatus = () => {

    const queryClient = useQueryClient()
    const { accessToken } = useSelector( state => state.login )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const updateTrainingStatus = async ({trainingIds, approveOrReject}) => {
        await api.put(`/training/status`, {
            trainingIds,
            approveOrReject
        }, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
    }

    return useMutation(updateTrainingStatus, {
        onSuccess: () => {
            toast.success('Updated Successfully')
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

export default useUpdateTrainingStatus
