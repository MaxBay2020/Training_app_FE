import * as yup from "yup";
import {UserRole, wordsLimit} from "./consts";

export const trainingSchemaForServicer = yup.object().shape({
    trainingName: yup.string().trim().min(1).max(wordsLimit).required(),
    trainingType: yup.mixed().oneOf(['LiveTraining', 'Webinar']).required(),
    // startdate: yup.date().max(new Date()).required(),
    // enddate: yup.date().min(yup.ref('startDate')).max(new Date()).required(),
    trainingUrl: yup.string().url().min(0).max(wordsLimit),

    isServicerCoordinator: yup.boolean().required(),
    traineeEmail: yup.string().email()
        .when('isServicerCoordinator', ([isServicerCoordinator], schema) => {
        return isServicerCoordinator ? schema.required() : schema.notRequired()
    }),
})

export const getTrainingSchema = userRole => {
    const isServicerCoordinator = userRole === UserRole.SERVICER_COORDINATOR

    return yup.object().shape({
        trainingName: yup.string().trim().min(1).max(wordsLimit).required(),
        trainingType: yup.mixed().oneOf(['LiveTraining', 'Webinar']).required(),
        // startdate: yup.date().max(new Date()).required(),
        // enddate: yup.date().min(yup.ref('startDate')).max(new Date()).required(),
        trainingHours: yup.number().min(1).positive().integer().required(),
        // trainingUrl: yup.string().trim().url().min(0).max(wordsLimit),
        trainingUrl: yup.string().trim().url().min(0).max(wordsLimit)
            .when('trainingType', ([trainingType], schema) => {
            return trainingType === 'Webinar' ? schema.required() : schema.notRequired()
        }),
        // traineeEmail: isServicerCoordinator ? yup.string().trim().email().required() : yup.string().trim().email().notRequired(),
        // traineeFirstName: isServicerCoordinator ? yup.string().trim().required() : yup.string().trim().notRequired(),
        // traineeLastName: isServicerCoordinator ? yup.string().trim().required() : yup.string().trim().notRequired(),
    })
}
