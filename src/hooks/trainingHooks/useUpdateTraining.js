import api from "../../api/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {userLogout} from "../../features/userSlice";
import {useNavigate} from "react-router-dom";



const useUpdateTraining = () => {

    const queryClient = useQueryClient()
    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const updateTraining = async (updatedTraining) => {
        const { trainingId } = updatedTraining
        await api.put(`/training/${trainingId}`, updatedTraining, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
    }


    return useMutation(updateTraining, {
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

export default useUpdateTraining
