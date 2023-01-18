import Button from "@mui/material/Button";
import TrainingModal from "../trainingModal/TrainingModal";
import {useState} from "react";

const TrainingCreation = () => {
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

            <TrainingModal
                open={open}
                setOpen={setOpen}
                isCreating={true}
                isUpdating={false}
            />
        </>
    )
}

export default TrainingCreation
