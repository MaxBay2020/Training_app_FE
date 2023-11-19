import Button from "@mui/material/Button";
import {useState} from "react";
import UserModal from "../userModal/UserModal";

const UserCreation = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="contained"
                disableElevation
                onClick={() => setOpen(true)}
                sx={{width: '100%'}}
            >
                Add User
            </Button>

            <UserModal
                open={open}
                setOpen={setOpen}
                isCreating={true}
                isUpdating={false}
            />
        </>
    )
}

export default UserCreation
