import {
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    Modal,
    OutlinedInput,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import TrainingCreation from "../components/TrainingPage/trainingCreate/TrainingCreation";
import TrainingTableForServicer from "../components/TrainingPage/trainingTable/TrainingTableForServicer";
import {useEffect, useState} from "react";
import TrainingTableForAdmin from "../components/TrainingPage/trainingTable/TrainingTableForAdmin";
import TrainingTableForApprover from "../components/TrainingPage/trainingTable/TrainingTableForApprover";
import {useSelector} from "react-redux";
import useDebounce from "../hooks/trainingHooks/useDebounce";
import useFetchTrainings from "../hooks/trainingHooks/useFetchTrainings";
import {pageLimit, targetTableToDownload, UserRole} from "../utils/consts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useFetchTrainingCredits from "../hooks/trainingHooks/useFetchTrainingCredits";
import TrainingTableForSupServicer from "../components/TrainingPage/trainingTable/TrainingTableForSupServicer";
import PageHeader from "../components/pageHeader/PageHeader";

const TrainingPage = () => {

    const [order, setOrder] = useState('DESC')
    const [orderBy, setOrderBy] = useState('Submitted at')

    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const {
        userName,
        userRole,
        servicerId,
        servicerMasterName,
        servicerCoordinator,
    } = useSelector(state => state.user)


    const {data: trainingCredits} = useFetchTrainingCredits(['queryTrainingCredits'])
    const {isLoading, data, error, isError, isFetching}
        = useFetchTrainings(
        ['queryAllTrainings', debouncedSearchKeyword, order, orderBy, page, limit], page, limit, debouncedSearchKeyword, order, orderBy)

    useEffect(() => {
        setPage(1)
    }, [debouncedSearchKeyword])


    const renderTrainingTable = userRole => {
        if (userRole.toUpperCase() === UserRole.SERVICER) {
            return <TrainingTableForServicer
                trainingList={data.trainingList}
                order={order}
                setOrder={setOrder}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
            />
        } else if (userRole.toUpperCase() === UserRole.SERVICER_COORDINATOR) {
            return <TrainingTableForSupServicer
                trainingList={data.trainingList}
                order={order}
                setOrder={setOrder}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
            />
        } else if (userRole.toUpperCase() === UserRole.ADMIN) {
            return <TrainingTableForAdmin
                trainingList={data.trainingList}
                order={order}
                setOrder={setOrder}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
            />
        } else if (userRole.toUpperCase() === UserRole.APPROVER) {
            return <TrainingTableForApprover
                trainingList={data.trainingList}
                order={order}
                setOrder={setOrder}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
            />
        }
    }

    const renderTrainingCredits = userRole => {
        if (userRole === UserRole.SERVICER || userRole === UserRole.SERVICER_COORDINATOR) {
            return (
                <Grid container direction='column' alignItems='flex-end' sx={{mt: 2}} spacing={1}>
                    <Grid item><Typography variant='subtitle'>Total Approved Trainings for
                        User: {trainingCredits?.approvedTrainingCount}</Typography></Grid>
                    <Grid item><Typography variant='subtitle'>Total Approved Trainings for
                        Servicer: {trainingCredits?.totalApprovedTrainingCount}</Typography></Grid>
                    {/*<Grid item><Typography variant='subtitle'>Total Annual Training Credit for Servicer for fiscal year till date (Max 1%): {trainingCredits?.scorePercentage}</Typography></Grid>*/}
                </Grid>
            )
        }
    }



    const renderAddTrainingButton = userRole => {
        if (userRole === UserRole.SERVICER || userRole === UserRole.SERVICER_COORDINATOR) {
            return <Grid item xs={4} md={2}><TrainingCreation/></Grid>
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
                servicerCoordinator={servicerCoordinator}
                currentPage={targetTableToDownload.trainingTable}
                searchKeyword={debouncedSearchKeyword}
                orderBy={orderBy}
                order={order}
            />

            <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
                {
                    data && renderAddTrainingButton(data.userRole)
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
                {data && renderTrainingTable(data.userRole)}
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

            {data && renderTrainingCredits(data.userRole)}
        </BasicLayout>

    )
}

export default TrainingPage
