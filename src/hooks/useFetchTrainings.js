import {useQuery} from "@tanstack/react-query";
import api from "../api/api";


const useFetchTrainings = (queryIdentifier, page = 1, limit, searchKeyword, sortBy = 1, reqBody) => {
    const url = searchKeyword ?
        `/training?page=${page}&limit=${limit}&sortBy=${sortBy}&searchKeyword=${searchKeyword}`
        :
        `/training?page=${page}&limit=${limit}&sortBy=${sortBy}`

    const fetchData = async () => {
        const res = await api.post(url, reqBody)
        return res.data
    }

    return useQuery(queryIdentifier, fetchData, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        refetchIntervalInBackground: true,
        keepPreviousData: true,

    })

}

export default useFetchTrainings
