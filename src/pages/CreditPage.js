import {
    Container,
    FormControl,
    Grid,
    InputLabel,
    Pagination,
    Select,
    TextField, Tooltip
} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import {useState} from "react";
import {useSelector} from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import useDebounce from "../hooks/trainingHooks/useDebounce";
import {pageLimit, UserRole} from "../utils/consts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreditTable from "../components/CreditPage/CreditTable";
import useFetchCredits from "../hooks/creditHooks/useFetchCredits";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import IconButton from "@mui/material/IconButton";

const CreditPage = () => {

    // 1 - sort by training created time
    // 2 - sort by training name
    const [sortBy, setSortBy] = useState(1)
    const [searchKeyword, setSearchKeyword] = useState('')
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const {
        userName,
        userRole,
    } = useSelector(state => state.user)



    const {isLoading, data, error, isError}
        = useFetchCredits(
            ['queryAllCredits', debouncedSearchKeyword, sortBy, page, limit], page, limit, debouncedSearchKeyword, sortBy)

    const searchHandler = e => {
        setSearchKeyword(e.target.value)
    }

    return (
        <BasicLayout>
            <Container>
                <Grid container alignItems='center' justifyContent='space-between'>
                    <Grid item>
                        <Grid container direction='column' alignItems='flex-start' sx={{mb: 5}} spacing={1}>
                            <Grid item><Typography variant='subtitle'>{`User Name:   ${userName}`}</Typography></Grid>
                            <Grid item><Typography variant='subtitle'>{`User Role:   ${userRole}`}</Typography></Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Tooltip title="download">
                            <IconButton><CloudDownloadOutlinedIcon /></IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>


                <Grid container alignItems='center' justifyContent='space-between' sx={{mb: 3}} spacing={1}>
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
                    {
                        data &&
                        <CreditTable
                            creditsStats={data.creditsStats}
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
            </Container>
        </BasicLayout>

    )
}

export default CreditPage
