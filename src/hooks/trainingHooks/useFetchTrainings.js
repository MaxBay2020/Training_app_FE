import {useQuery} from "@tanstack/react-query";
import api from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../../features/userSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


const useFetchTrainings = (queryIdentifier, page = 1, limit, searchKeyword, sortBy = 1) => {

    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const url = searchKeyword ?
        `/training?page=${page}&limit=${limit}&sortBy=${sortBy}&searchKeyword=${searchKeyword}`
        :
        `/training?page=${page}&limit=${limit}&sortBy=${sortBy}`

    const fetchData = async () => {
        const res = await api.get(url, {
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

export default useFetchTrainings
