import {FormControl, FormHelperText, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import {DayPicker} from "react-day-picker";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import IconButton from "@mui/material/IconButton";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import {useState} from "react";
import moment from "moment";

const TrainingDatePicker = ({date, setDate, name}) => {
    const [showDatePicker, setShowDatePicker] = useState(false)

    return (
        <>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-dates">{name}</InputLabel>
                <OutlinedInput
                    value={date && moment(date).format('YYYY-MM-DD')}
                    id="outlined-adornment-dates"
                    type='text'
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                edge="end"
                            >
                                {showDatePicker ?  <EventBusyIcon />: <CalendarMonthOutlinedIcon />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="dates"
                />
            </FormControl>

            {
                showDatePicker &&
                <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />
            }

        </>
    )
}

export default TrainingDatePicker
