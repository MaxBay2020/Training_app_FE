import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import AuthenticationPage from "./pages/AuthenticationPage";
import TrainingPage from "./pages/TrainingPage";
import {useSelector} from "react-redux";
import {ToastContainer} from "react-toastify";
import React from "react";


const App = () => {

    const { accessToken } = useSelector(state => state.login)

  return (
      <Router>
          <Routes>
              <Route path='/authentication' element={ accessToken ? <Navigate to='/training' /> : <AuthenticationPage /> } />
              <Route path='/training' element={ accessToken ? <TrainingPage /> : <Navigate to='/authentication' /> } />
          </Routes>
      </Router>
  );
}

export default App;
