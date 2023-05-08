import {useQuery} from "@tanstack/react-query";
import api from "../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../../features/userSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import { saveAs } from 'file-saver'


const useDownloadCredit = (queryIdentifier, fileType) => {

    const { accessToken } = useSelector( state => state.user )
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const url = '/credit/download'

    const fetchData = async () => {
        const res = await api.get(url, {
            headers: {
                authorization: `Bearer ${accessToken}`,
                fileType
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
            let fileExtension = ''
            let type = ''
            if(fileType === 1){
                // download excel
                type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
                fileExtension = 'xlsx'

            }else if(fileType === 2){
                type = 'application/pdf'
                fileExtension = 'pdf'

                // FOR TEMP USE
                const blob = new Blob([data], { type })
                if(data.type === 'application/octet-stream'){
                    return
                }
                saveAs(blob, `${Date.now()}.${fileExtension}`)
                return
            }
             const blob = new Blob([data], { type })
             saveAs(blob, `${Date.now()}.${fileExtension}`)
         }
    })

}

export default useDownloadCredit
