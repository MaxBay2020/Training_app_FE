import Button from "@mui/material/Button";
import UserModal from "../adminModal/UserModal.js";
import {useState} from "react";

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
