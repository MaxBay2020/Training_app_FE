import {
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
import {useState} from "react";
import TrainingTableForAdmin from "../components/TrainingPage/trainingTable/TrainingTableForAdmin";
import TrainingTableForApprover from "../components/TrainingPage/trainingTable/TrainingTableForApprover";
import useFetchTrainingTypes from "../hooks/trainingHooks/useFetchTrainingTypes";
import {useSelector} from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import { debounce } from "lodash"
import useDebounce from "../hooks/trainingHooks/useDebounce";
import useFetchTrainings from "../hooks/trainingHooks/useFetchTrainings";
import {pageLimit, sortingSystem, UserRole} from "../utils/consts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useFetchTrainingCredits from "../hooks/trainingHooks/useFetchTrainingCredits";

const TrainingPage = () => {

    // 1 - sort by training created time
    // 2 - sort by training name
    const [sortBy, setSortBy] = useState(sortingSystem.trainingPage.defaultSortValue)
    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const {
        userName,
        userRoles,
        servicerId,
        servicerMasterName,
    } = useSelector(state => state.user)


    const { data: trainingCredits } = useFetchTrainingCredits(['queryTrainingCredits'])

    const {isLoading, data, error, isError}
        = useFetchTrainings(
            ['queryAllTrainings', debouncedSearchKeyword, sortBy, page, limit], page, limit, debouncedSearchKeyword, sortBy)

    const renderTrainingTable = userRoles => {
        if(userRoles.includes(UserRole.SERVICER)){
            return <TrainingTableForServicer trainingList={data.trainingList} />
        }else if(userRoles.includes(UserRole.ADMIN)){
            return <TrainingTableForAdmin trainingList={data.trainingList} />
        }else if(userRoles.includes(UserRole.APPROVER)){
            return <TrainingTableForApprover trainingList={data.trainingList} />
        }
    }

    const renderTrainingCredits = userRoles => {
        if(userRoles.includes(UserRole.SERVICER)){
            return (
                <Grid container direction='column' alignItems='flex-end' sx={{mt: 2}} spacing={1}>
                    <Grid item><Typography variant='subtitle'>Total Approved Trainings for User:  {trainingCredits?.approvedTrainingCount}</Typography></Grid>
                    <Grid item><Typography variant='subtitle'>Total Approved Trainings for Servicer:  {trainingCredits?.totalApprovedTrainingCount}</Typography></Grid>
                    {/*<Grid item><Typography variant='subtitle'>Total Annual Training Credit for Servicer for fiscal year till date (Max 1%): {trainingCredits?.scorePercentage}</Typography></Grid>*/}
                </Grid>
            )
        }
    }

    const renderUserInfo = userRoles => {
        if(userRoles.includes(UserRole.SERVICER)){
            return (
               <>
                   <Grid item><Typography variant='subtitle'>{servicerId && `Servicer ID:    ${servicerId}`}</Typography></Grid>
                   <Grid item><Typography variant='subtitle'>{servicerMasterName && `Servicer Name:    ${servicerMasterName}`}</Typography></Grid>
               </>
            )
        }
    }

    const renderAddTrainingButton = userRoles => {
        if(userRoles.includes(UserRole.SERVICER)){
            return <Grid item xs={4} md={2}><TrainingCreation /></Grid>
        }
        return <></>
    }


    const searchHandler = e => {
        setSearchKeyword(e.target.value)
    }

    return (
        <BasicLayout>
            <Container>
                <Grid container direction='column' alignItems='flex-start' sx={{mb: 5}} spacing={1}>
                    <Grid item><Typography variant='subtitle'>{`User Name:   ${userName}`}</Typography></Grid>
                    <Grid item><Typography variant='subtitle'>{`User Role:   ${userRoles}`}</Typography></Grid>
                    { data && renderUserInfo(data.userRoles) }
                </Grid>

                <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
                    {
                        data && renderAddTrainingButton(data.userRoles)
                    }
                    <Grid item xs={true} md={true}>
                        <TextField
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            size="small"
                            sx={{ width: '100%' }}
                            value={searchKeyword}
                            onChange={e => searchHandler(e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sortBy}
                                label="sortBy"
                                onChange={e => setSortBy(e.target.value)}
                            >
                                {
                                    sortingSystem.trainingPage.trainingPageSortBy.map(sort => <MenuItem key={sort.value} value={sort.value}>{sort.label}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{minHeight: '390px'}}>
                    { data && renderTrainingTable(data.userRoles) }
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

                { data && renderTrainingCredits(data.userRoles)}
            </Container>
        </BasicLayout>

    )
}

export default TrainingPage
