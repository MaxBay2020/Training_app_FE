import api from "../../api/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useDispatch, useSelector} from "react-redux"
import { toast } from 'react-toastify'
import {userLogout} from "../../features/loginSlice";
import { useNavigate } from 'react-router-dom'


const useCreateTraining = () => {

    const queryClient = useQueryClient()
    const { accessToken } = useSelector( state => state.login )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const createTraining = async (newTraining) => {
        await api.post('training/add', newTraining, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
    }


    return useMutation(createTraining, {
        onSuccess: () => {
            toast.success('Created Successfully')
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

export default useCreateTraining
