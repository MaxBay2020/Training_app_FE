import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import AuthenticationPage from "./pages/AuthenticationPage";
import TrainingPage from "./pages/TrainingPage";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useMemo} from "react";
import CreditPage from "./pages/CreditPage";
import UploadedTrainingsPage from "./pages/UploadedTrainingsPage";
import {addUploadedTrainings} from "./features/trainingSlice";
import ManageUserPage from "./pages/ManageUserPage";


const App = () => {

    const { accessToken } = useSelector(state => state.user)

  return (
      <Router>
          <Routes>
              <Route path='authentication' element={ accessToken ? <Navigate to='/training' /> : <AuthenticationPage /> } />
              <Route path='training'>
                  <Route index element={ accessToken ? <TrainingPage /> : <Navigate to='/authentication' /> } />
                  <Route path='uploads' element={ accessToken ? <UploadedTrainingsPage /> : <Navigate to='/authentication' /> } />
              </Route>
              <Route path='credit'>
                  <Route index element={ accessToken ? <CreditPage /> : <Navigate to='/authentication' /> } />
              </Route>
              <Route path='admin'>
                  <Route path='user' element={ accessToken ? <ManageUserPage /> : <Navigate to='/authentication' /> } />
                  <Route path='servicer' element={ accessToken ? <ManageUserPage /> : <Navigate to='/authentication' /> } />
              </Route>
          </Routes>
      </Router>
  );
}

export default App;
