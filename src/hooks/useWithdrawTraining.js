import api from "../api/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import { toast } from 'react-toastify'

const withdrawTraining = async ({ email, trainingId }) => {
    const res = await api.delete(`training/${trainingId}`, { data: { email } })
}

const useWithdrawTraining = () => {

    const queryClient = useQueryClient()
    const { email } = useSelector( state => state.login )


    return useMutation(withdrawTraining, {
        onSuccess: () => {
            toast.success('Withdrawn Successfully')
            queryClient.invalidateQueries(['queryAllTrainings', email])
        },
        onError: (e) => {
            const { message } = e.response.data
            toast.error(message)
        }
    })
}

export default useWithdrawTraining
