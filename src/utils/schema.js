import * as yup from "yup";
import {wordsLimit} from "./consts";

export const trainingSchema = yup.object().shape({
    trainingName: yup.string().trim().min(1).max(wordsLimit).required(),
    trainingType: yup.mixed().oneOf(['LiveTraining', 'Webinar']).required(),
    // startdate: yup.date().max(new Date()).required(),
    // enddate: yup.date().min(yup.ref('startDate')).max(new Date()).required(),
    trainingUrl: yup.string().url().min(0).max(wordsLimit)
})
