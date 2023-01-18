import api from "../api/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux"
import { toast } from 'react-toastify'

const createTraining = async (newTraining) => {
    const res = await api.post('training/add', newTraining)
}

const useCreateTraining = () => {

    const queryClient = useQueryClient()
    const { email } = useSelector( state => state.login )


    return useMutation(createTraining, {
        onSuccess: () => {
            toast.success('Created Successfully')
            queryClient.invalidateQueries(['queryAllTrainings', email])
        },
        onError: (e) => {
            const { message } = e.response.data
            toast.error(message)
        }
    })
}

export default useCreateTraining
