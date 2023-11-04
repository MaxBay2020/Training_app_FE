import {
    CircularProgress,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    Pagination,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import { pageLimit,  targetTableToDownload, UserRole } from '../utils/consts';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useFetchUsers from "../hooks/adminHooks/useFetchUsers";
import BasicLayout from '../layout/BasicLayout';
import useDebounce from '../hooks/trainingHooks/useDebounce';
import PageHeader from "../components/pageHeader/PageHeader";

const AdminUserPage = () => {
    const [order, setOrder] = useState('DESC')
    const [orderBy, setOrderBy] = useState('Created Date')

    const [searchKeyword, setSearchKeyword] = useState("")

    const debouncedSearchKeyword = useDebounce(searchKeyword, 300)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(pageLimit)

    const { userName, userRole, servicerId, servicerMasterName } = useSelector(
        (state) => state.user
    );

    const [fileType, setFileType] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const {isLoading, data, error, isError, isFetching} = useFetchUsers(
        ['queryAllUsers', debouncedSearchKeyword, orderBy, order, page, limit],
        page,
        limit,
        debouncedSearchKeyword,
        order, orderBy
    )

    useEffect(() => {
        setPage(1)
    }, [debouncedSearchKeyword])

    useEffect(() => {
        setPage(1);
    }, [orderBy, order])

    const searchHandler = (e) => {
        setSearchKeyword(e.target.value)
    }
    const renderTrainingTable = userRole => {
        switch (userRole){
            case UserRole.SERVICER:
            case UserRole.SERVICER_COORDINATOR:
            case UserRole.APPROVER:
                return

            case UserRole.ADMIN:
                return <UserTable
                    userList={data.userList}
                    order={order}
                    setOrder={setOrder}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    page={page}
                />
        }
    }


    const renderAddUserButton = userRole => {
        if (userRole.toUpperCase() === UserRole.ADMIN) {
            return (
                <Grid item xs={4} md={2}>
                    <UserCreation />
                </Grid>
            );
        }
        return <></>;
    };

    return (
        <BasicLayout>
            <Container>
                <Box display="flex" justifyContent="center" width="100%" marginBottom={5}>
                    <Typography variant="h4">
                        USER MAINTENANCE
                    </Typography>
                </Box>

                <PageHeader
                    userName={userName}
                    userRole={userRole}
                    servicerId={servicerId}
                    servicerMasterName={servicerMasterName}
                    currentPage={targetTableToDownload.userTable}
                    searchKeyword={debouncedSearchKeyword}
                    orderBy={orderBy}
                    order={order}
                />

                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                    spacing={1}
                >
                    {data && renderAddUserButton(data.userRole)}
                    <Grid item xs={true} md={true}>
                        <TextField
                            id="outlined-basic"
                            label="Search"
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                            value={searchKeyword}
                            onChange={(e) => searchHandler(e)}
                        />
                    </Grid>

                </Grid>

                <Box sx={{ minHeight: "390px" }}>
                    {data && renderUserTable(data.userRole)}
                </Box>

                {data && (
                    <Pagination
                        sx={{ mt: 2 }}
                        count={data.totalPage}
                        page={page}
                        onChange={(_e, v) => setPage(v)}
                    />
                )}
            </Container>{" "}
            <Box marginBottom={5}></Box>
        </BasicLayout>
    );
};

export default AdminUserPage;
