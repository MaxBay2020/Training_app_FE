import * as yup from "yup";
import {wordsLimit} from "./consts";

const urlRegExp = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/

export const getTrainingSchema = (dateRange) => {
    return yup.object().shape({
        trainingName: yup.string().trim().min(1).max(wordsLimit).required(),
        trainingType: yup.mixed().oneOf(['LiveTraining', 'Webinar']).required(),
        startDate: yup.date().max(new Date()).required(),
        endDate: yup.date().min(yup.ref('startDate')).max(new Date()).required(),
        trainingHours: yup.number().min(1).positive().integer().required(),
        trainingUrl: yup.string().trim()
            .when('trainingType', ([trainingType], schema) => {
                return trainingType === 'Webinar' ?
                    schema.required('Training URL is required for Webinar')
                        .matches(urlRegExp, 'Please enter a valid url')
                        .min(0).max(wordsLimit)
                    : schema.notRequired()
            })
    })
}

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const onlyNumberRegExp = /^\d$/

export const traineeSchema = yup.object().shape({
    traineeEmail: yup.string().trim().matches(emailRegExp, 'Trainee email must be a valid email'),
    traineeFirstName: yup.string().trim().required('Trainee firstname is a required field') ,
    traineeLastName: yup.string().trim().required('Trainee lastname is a required field') ,
})

export const userSchema = yup.object().shape({
    firstName: yup.string().trim().min(1).required('First name is required'),
    lastName: yup.string().trim().min(1).required('Last name is required'),
    newUserEmail: yup.string().trim().matches(emailRegExp, 'Email is not valid').required('Email is required'),
    userRoleId: yup.string().required('User role is required'),
    servicerId: yup.string().required('Servicer is required'),
})

export const servicerSchema = yup.object().shape({
    servicerId: yup.string().trim().length(5).required('Servicer ID is required'),
    servicerName: yup.string().trim().min(1).required('Servicer name is required'),
    servicerTrsiiOptIn: yup.string().oneOf(['true', 'false']),
    servicerOptOutFlag: yup.string().oneOf(['true', 'false']),
})

