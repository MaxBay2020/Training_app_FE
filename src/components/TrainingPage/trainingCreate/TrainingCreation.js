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
                onClick={() => setOpen(true)}
                sx={{width: '100%'}}
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
