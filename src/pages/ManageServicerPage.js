import {
    Grid,
    Pagination,
    TextField,
} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useDebounce from "../hooks/trainingHooks/useDebounce";
import {pageLimit, targetTableToDownload, UserRole} from "../utils/consts";
import Box from "@mui/material/Box";
import PageHeader from "../components/pageHeader/PageHeader";
import useFetchServicers from "../hooks/adminHooks/useFetchServicers";
import ServicerCreation from "../components/manageServicerPage/servicerCreation/ServicerCreation";
import ManageServicerTable from "../components/manageServicerPage/ManageServicerTable";

const ManageServicerPage = () => {

    const [openUserModal, setOpenUserModal] = useState(false)

    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [order, setOrder] = useState('DESC')
    const [orderBy, setOrderBy] = useState('Servicer ID')

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const {
        userName,
        userRole,
        servicerId,
        servicerMasterName,
    } = useSelector(state => state.user)

    const { data }
        = useFetchServicers(
        ['queryAllServicers', debouncedSearchKeyword, order, orderBy, page, limit], page, limit, debouncedSearchKeyword, order, orderBy)

    useEffect(() => {
        setPage(1)
    }, [debouncedSearchKeyword])

    const renderAddServicerButton = userRole => {
        if (userRole === UserRole.ADMIN) {
            return <Grid item>
                <ServicerCreation
                    openUserModal={openUserModal}
                    setOpenUserModal={setOpenUserModal}
                />
            </Grid>
        }
        return <></>
    }

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
                currentPage={targetTableToDownload.manageServicer}
                searchKeyword={debouncedSearchKeyword}
                orderBy={orderBy}
                order={order}
                hasDownloadFeature={false}
            />

            <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
                {
                    data && renderAddServicerButton(data.userRole)
                }

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
                    <ManageServicerTable
                        servicerList={data.servicerList || []}
                        order={order}
                        setOrder={setOrder}
                        orderBy={orderBy}
                        setOrderBy={setOrderBy}
                        openUserModal={openUserModal}
                        setOpenUserModal={setOpenUserModal}
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

export default ManageServicerPage
