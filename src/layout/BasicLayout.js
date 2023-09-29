import Navbar from "../components/navbar/Navbar";
import {Container} from "@mui/material";

const BasicLayout = ({children}) => {
    return (
        <>
            <Navbar />
            <Container maxWidth='xl'>
                {children}
            </Container>

        </>
    )
}

export default BasicLayout
