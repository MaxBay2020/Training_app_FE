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

    const { email } = useSelector(state => state.login)

  return (
      <Router>
          <Routes>
              <Route path='/authentication' element={<AuthenticationPage />} />
              <Route path='/training' element={email ? <TrainingPage /> : <Navigate to='/authentication' />} />
          </Routes>
      </Router>
  );
}

export default App;
