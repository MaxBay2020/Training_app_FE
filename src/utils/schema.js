import * as yup from "yup";
import {wordsLimit} from "./consts";

export const getTrainingSchema = (dateRange) => {
    return yup.object().shape({
        trainingName: yup.string().trim().min(1).max(wordsLimit).required(),
        trainingType: yup.mixed().oneOf(['LiveTraining', 'Webinar']).required(),
        startDate: yup.date().max(new Date()).required(),
        endDate: yup.date().min(yup.ref('startDate')).max(new Date()).required(),
        trainingHours: yup.number().min(1).positive().integer().required(),
        trainingUrl: yup.string().trim().url().min(0).max(wordsLimit)
            .when('trainingType', ([trainingType], schema) => {
            return trainingType === 'Webinar' ? schema.required() : schema.notRequired()
        }),
    })
}

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const traineeSchema = yup.object().shape({
    traineeEmail: yup.string().trim().matches(emailRegExp, 'Trainee email must be a valid email'),
    traineeFirstName: yup.string().trim().required('Trainee firstname is a required field') ,
    traineeLastName: yup.string().trim().required('Trainee lastname is a required field') ,
})
