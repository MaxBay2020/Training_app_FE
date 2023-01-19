import {useQuery} from "@tanstack/react-query";
import api from "../api/api";


const useFetchTrainingTypes = (queryIdentifier, url, reqBody) => {
    const fetchData = async () => {
        const res = await api.post(url, reqBody)
        return res.data
    }

    return useQuery(queryIdentifier, fetchData, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        refetchIntervalInBackground: true,
    })
}

export default useFetchTrainingTypes
