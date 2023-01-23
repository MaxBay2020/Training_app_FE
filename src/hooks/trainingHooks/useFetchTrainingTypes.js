import {useQuery} from "@tanstack/react-query";
import api from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {userLogout} from "../../features/loginSlice";


const useFetchTrainingTypes = (queryIdentifier, url) => {
    const { accessToken } = useSelector( state => state.login )
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
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        refetchIntervalInBackground: true,
        onError: (e) => {
            const statusCode = e.response.status
            if(statusCode === 402){
                dispatch(userLogout())
                navigate('/authentication')
            }
        }
    })
}

export default useFetchTrainingTypes
