import {useQuery} from "@tanstack/react-query";
import api from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../../features/userSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import { saveAs } from 'file-saver'


const useDownloadCreditPDF = (queryIdentifier) => {

    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const url = '/credit/download-pdf'

    const fetchData = async () => {
        const res = await api.get(url, {
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            responseType: 'blob'
        })
        return res.data
    }

    return useQuery(queryIdentifier, fetchData, {
        enabled: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: true,
        onError: (e) => {
            const statusCode = e.response.status
            if(statusCode === 402){
                dispatch(userLogout())
                navigate('/authentication')
            }
            const { message } = e.response.data
            toast.error(message)
        },
         onSuccess: (data) => {
             const pdfBlob = new Blob([data], { type: 'application/pdf' })
             saveAs(pdfBlob, `${Date.now()}.pdf`);
         }
    })

}

export default useDownloadCreditPDF
