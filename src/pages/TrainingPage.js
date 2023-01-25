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
import Box from "@mui/material/Box";

const TrainingPage = () => {

    // 1 - sort by training created time
    // 2 - sort by training name
    const [sortBy, setSortBy] = useState(1)
    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)


    const {isLoading, data, error, isError}
        = useFetchTrainings(
            ['queryAllTrainings', debouncedSearchKeyword, sortBy, page, limit], page, limit, debouncedSearchKeyword, sortBy)

    const renderTrainingTable = userRole => {
        if(userRole.toLowerCase() === 'servicer'){
            return <TrainingTableForServicer trainingList={data.trainingList} />
        }else if(userRole.toLowerCase() === 'admin'){
            return <TrainingTableForAdmin trainingList={data.trainingList} />
        }else if(userRole.toLowerCase() === 'approver'){
            return <TrainingTableForApprover trainingList={data.trainingList} />
        }
    }

    const renderAddTrainingButton = userRole => {
        if(userRole.toLowerCase() === 'servicer'){
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

                <Box sx={{minHeight: '390px'}}>
                    { data && renderTrainingTable(data.userRole) }
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
            </Container>
        </BasicLayout>

    )
}

export default TrainingPage
