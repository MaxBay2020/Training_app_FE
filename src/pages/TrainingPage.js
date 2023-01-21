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
import {pageLimit} from "../utils/consts";

const TrainingPage = () => {

    // 1 - sort by training created time
    // 2 - sort by training name
    const [sortBy, setSortBy] = useState(1)
    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const { accessToken } = useSelector(state => state.login)

    const {isLoading, data, error, isError}
        = useFetchTrainings(
            ['queryAllTrainings', debouncedSearchKeyword, sortBy, page, limit], page, limit, debouncedSearchKeyword, sortBy,{ accessToken })

    const renderTrainingTable = userRole => {
        if(userRole.toLowerCase() === 'servicer'){
            return <TrainingTableForServicer trainingList={data.trainingList} />
        }else if(userRole.toLowerCase() === 'admin'){
            return <TrainingTableForAdmin />
        }else if(userRole.toLowerCase() === 'approver'){
            return <TrainingTableForApprover />
        }
    }



    const searchHandler = e => {
        setSearchKeyword(e.target.value)
    }


    return (
        <BasicLayout>
            <Container>
                <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
                    <Grid item xs={4} md={2}><TrainingCreation /></Grid>
                    <Grid item xs={8} md={8}>
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
                                <MenuItem value={1}>Latest Created</MenuItem>
                                <MenuItem value={2}>Training Name</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                { data && renderTrainingTable(data.userRole) }

                {
                    data
                    &&
                    <Pagination
                        count={data.totalPage}
                        page={page}
                        onChange={(_e, v) => setPage(v)}
                    />
                }
            </Container>
        </BasicLayout>

    )
}

export default TrainingPage
