import {useQuery} from "@tanstack/react-query";
import axios from "axios";


const useFetchData = (url) => {
    const fetchAllTrainings = async () => {
        const res = await axios.get(url)
        return res.data
    }

    return useQuery(['queryAllTrainings'], fetchAllTrainings)
}

export default useFetchData
