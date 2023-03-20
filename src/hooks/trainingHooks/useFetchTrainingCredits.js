import api from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {userLogout} from "../../features/userSlice";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const useFetchTrainingCredits = (queryIdentifier) => {
    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fetchData = async () => {
        const res = await api.get('/training/trainingCredits', {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
        return res.data
    }

    return useQuery(queryIdentifier, fetchData, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        refetchIntervalInBackground: true,
        keepPreviousData: true,
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

export default useFetchTrainingCredits
