import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {userLogout} from "../features/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createOrUpdateEnum} from "../utils/consts";
import api from "../api/api";

const useCommonMutate = (whichQueryToRefetch, createOrUpdate, backendUrl) => {

    const queryClient = useQueryClient()
    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const mutateData = async data => {
        if(createOrUpdate === createOrUpdateEnum.create){
            await api.post(backendUrl, data, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
        }else if(createOrUpdate === createOrUpdateEnum.update){
            const { id } = data
            await api.put(`${backendUrl}/${id}`, data, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
        }else if(createOrUpdate === createOrUpdateEnum.delete){
            const { id } = data
            await api.delete(`${backendUrl}/${id}`, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
        }
    }

    return useMutation(mutateData, {
        onSuccess: () => {
            toast.success(`${createOrUpdate} Successfully`)
            queryClient.invalidateQueries(whichQueryToRefetch)
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

export default useCommonMutate
