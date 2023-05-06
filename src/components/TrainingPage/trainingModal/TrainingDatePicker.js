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
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {trainingSchema} from "../../../utils/schema";


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

const TrainingDatePicker = ({date, setDate, name, control, errors}) => {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const nameLowerCase = name.replace(' ', '').toLowerCase()

    return (
        <>
            <Controller
                control={control}
                name={nameLowerCase}
                render={({field})=>(
                    <FormControl
                        sx={commonStyles.fullWidth}
                        // variant="outlined"
                        {...field}
                        error={!!errors[nameLowerCase]}
                    >
                        <InputLabel htmlFor="outlined-adornment-dates">{name}</InputLabel>
                        <OutlinedInput
                            value={date && moment(date).format('YYYY-MM-DD')}
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

                        {
                            errors[nameLowerCase] && <FormHelperText id="my-helper-text">{errors[nameLowerCase].message}</FormHelperText>
                        }
                    </FormControl>
                )}
            >

            </Controller>

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

        </>
    )
}

export default TrainingDatePicker
