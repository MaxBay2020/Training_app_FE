import {Container} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import TrainingTable from "../components/trainingTable/TrainingTable";

const TrainingPage = () => {
    return (
        <BasicLayout>
            <Container>
                <TrainingTable />
            </Container>
        </BasicLayout>

    )
}

export default TrainingPage
