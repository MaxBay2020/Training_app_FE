import Button from "@mui/material/Button";
import UserModal from "../adminModal/UserModal.js";
import {useState} from "react";

const UserUpdate = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="contained"
                disableElevation
                sx={{marginBottom: 3}}
                onClick={() => setOpen(true)}
            >
                Add Training
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

export default UserUpdate
