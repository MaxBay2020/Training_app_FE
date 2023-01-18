import api from "../api/api";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

const updateTraining = async (updatedTraining) => {
    const { trainingId } = updatedTraining
    const res = await api.put(`/training/${trainingId}`, updatedTraining)
}

const useUpdateTraining = () => {

    const queryClient = useQueryClient()
    const { email } = useSelector( state => state.login )


    return useMutation(updateTraining, {
        onSuccess: () => {
            toast.success('Updated Successfully')
            queryClient.invalidateQueries(['queryAllTrainings', email])
        },
        onError: (e) => {
            const { message } = e.response.data
            toast.error(message)
        }
    })
}

export default useUpdateTraining
