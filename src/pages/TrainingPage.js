import {Container, Modal, Pagination} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import TrainingTable from "../components/TrainingPage/trainingTable/TrainingTable";
import TrainingCreation from "../components/TrainingPage/trainingCreate/TrainingCreation";

const TrainingPage = () => {


    return (
        <BasicLayout>
            <Container>
                <TrainingCreation />
                <TrainingTable />
                <Pagination count={10} />
            </Container>
        </BasicLayout>

    )
}

export default TrainingPage
