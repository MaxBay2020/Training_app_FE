import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import api from "../../api/api";
import {useQuery} from "@tanstack/react-query";
import {userLogout} from "../../features/userSlice";

const useCommonGetQuery = (queryIdentifier, url, options = {}) => {
    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        staleTime: 1000 * 60 * 60 * 24,
        ...options,
        onError: (e) => {
            const statusCode = e.response.status
            if(statusCode === 402){
                dispatch(userLogout())
                navigate('/authentication')
            }
        }
    })
}

export default useCommonGetQuery
