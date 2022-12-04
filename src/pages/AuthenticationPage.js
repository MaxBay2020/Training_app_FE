import {Container, TextField} from "@mui/material";
import BasicLayout from "../layout/BasicLayout";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {userLogin} from "../features/loginSlice";

const AuthenticationPage = () => {
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()
    const {email: emailStore} = useSelector((state) => state.login)

    const login = () => {
        dispatch(userLogin({email}))
    }

    return (
        <BasicLayout>
            <Container>
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    onChange={e=>setEmail(e.target.value)}
                />
                <Button variant="contained" onClick={()=>login()}>Login</Button>
                <Typography variant='h6'>Email: {emailStore}</Typography>
            </Container>
        </BasicLayout>
    )
}

export default AuthenticationPage
