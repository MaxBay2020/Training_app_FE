import {Container} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import {useState} from "react";
import Login from "../components/authentication/login/Login";
import Register from "../components/authentication/register/Register";

const AuthenticationPage = () => {
    // this is js code
    const [showRegister, setShowRegister] = useState(false)

    // this is html code
    return (
        <BasicLayout>
            <Container>
                {
                    showRegister ?
                        <Register setShowRegister={setShowRegister} />
                        :
                        <Login setShowRegister={setShowRegister}/>
                }
            </Container>
        </BasicLayout>
    )
}

export default AuthenticationPage
