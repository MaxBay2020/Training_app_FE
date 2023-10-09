import {
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    Pagination,
    Select,
    TextField, Tooltip
} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useDebounce from "../hooks/trainingHooks/useDebounce";
import {pageLimit, targetTableToDownload, UserRole} from "../utils/consts";
import Box from "@mui/material/Box";
import CreditTable from "../components/CreditPage/CreditTable";
import useFetchCredits from "../hooks/creditHooks/useFetchCredits";
import PageHeader from "../components/pageHeader/PageHeader";

const CreditPage = () => {

    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [order, setOrder] = useState('DESC')
    const [orderBy, setOrderBy] = useState('Fiscal Year')

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const {
        userName,
        userRole,
        servicerId,
        servicerMasterName,
    } = useSelector(state => state.user)

    const { data }
        = useFetchCredits(
        ['queryAllCredits', debouncedSearchKeyword, order, orderBy, page, limit], page, limit, debouncedSearchKeyword, order, orderBy)


    useEffect(() => {
        setPage(1)
    }, [debouncedSearchKeyword])


    const searchHandler = e => {
        setSearchKeyword(e.target.value)
    }

    return (
        <BasicLayout>
            <PageHeader
                userName={userName}
                userRole={userRole}
                servicerId={servicerId}
                servicerMasterName={servicerMasterName}
                currentPage={targetTableToDownload.creditTable}
                searchKeyword={debouncedSearchKeyword}
                orderBy={orderBy}
                order={order}
            />

            <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
                <Grid item xs={true} md={true}>
                    <TextField
                        id="outlined-basic"
                        label="Search"
                        variant="outlined"
                        size="small"
                        sx={{width: '100%'}}
                        value={searchKeyword}
                        onChange={e => searchHandler(e)}
                    />
                </Grid>
            </Grid>

            <Box sx={{minHeight: '390px'}}>
                {
                    data &&
                    <CreditTable
                        creditList={data.creditsStats}
                        order={order}
                        setOrder={setOrder}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                    />
                }
            </Box>


            {
                data
                &&
                <Pagination
                    sx={{mt: 2}}
                    count={data.totalPage}
                    page={page}
                    onChange={(_e, v) => setPage(v)}
                />
            }
        </BasicLayout>

    )
}

export default CreditPage
