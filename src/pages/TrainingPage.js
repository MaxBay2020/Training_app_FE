import {Container, Modal, Pagination} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import TrainingCreation from "../components/TrainingPage/trainingCreate/TrainingCreation";
import TrainingTableForServicer from "../components/TrainingPage/trainingTable/TrainingTableForServicer";
import {useState} from "react";
import TrainingTableForAdmin from "../components/TrainingPage/trainingTable/TrainingTableForAdmin";
import TrainingTableForApprover from "../components/TrainingPage/trainingTable/TrainingTableForApprover";
import useFetchData from "../hooks/useFetchData";
import {useSelector} from "react-redux";

const TrainingPage = () => {

    const { email } = useSelector(state => state.login)

    const {isLoading, data, error, isError}
        = useFetchData(['queryAllTrainings', email], '/training', { email })

    // console.log(trainingList)

    const renderTrainingTable = userRole => {
        if(userRole.toLowerCase() === 'servicer'){
            return <TrainingTableForServicer trainingList={data.trainingList} />
        }else if(userRole.toLowerCase() === 'admin'){
            return <TrainingTableForAdmin />
        }else if(userRole.toLowerCase() === 'approver'){
            return <TrainingTableForApprover />
        }
    }


    return (
        <BasicLayout>
            <Container>
                <TrainingCreation />

                { data && renderTrainingTable(data.userRole)}

                <Pagination count={10} />
            </Container>
        </BasicLayout>

    )
}

export default TrainingPage
