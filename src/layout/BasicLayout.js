import Navbar from "../components/navbar/Navbar";

const BasicLayout = ({children}) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default BasicLayout
