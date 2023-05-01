import {FormControl, FormHelperText, InputAdornment, InputLabel, Modal, OutlinedInput, TextField} from "@mui/material";
import {DayPicker} from "react-day-picker";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import IconButton from "@mui/material/IconButton";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import {useState} from "react";
import moment from "moment";
import {commonStyles} from "../../../styles/commontStyles";
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";


const styles = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
    },
    dataPickerBox: {
        display: 'flex',
        justifyContent: 'center'
    }
};

const TrainingDatePicker = ({date, setDate, name}) => {
    const [showDatePicker, setShowDatePicker] = useState(false)

    return (
        <>
            <FormControl sx={commonStyles.fullWidth} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-dates">{name}</InputLabel>
                <OutlinedInput
                    value={date && moment(date).format('MM-DD-YYYY')}
                    id="outlined-adornment-dates"
                    type='text'
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowDatePicker(true)}
                                edge="end"
                            >
                                {showDatePicker ?  <EventBusyIcon />: <CalendarMonthOutlinedIcon />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="dates"
                />
            </FormControl>

            <Modal
                open={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modalBox}>
                    <DayPicker
                        style={styles.dataPickerBox}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        onDayClick={()=>setShowDatePicker(false)}
                    />
                </Box>
            </Modal>

            <Modal
                open={showDatePicker}
                onClose={()=> setShowDatePicker(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box  sx={datePickerStyles.datePickerBox}>
                    <DayPicker
                        style={{justify:'center'}}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                    />
                </Box>
            </Modal>
        </>
    )
}

export default TrainingDatePicker
