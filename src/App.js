import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import AuthenticationPage from "./pages/AuthenticationPage";
import TrainingPage from "./pages/TrainingPage";
import {useSelector} from "react-redux";
import React from "react";


const App = () => {

    const { accessToken } = useSelector(state => state.user)

  return (
      <Router>
          <Routes>
              <Route path='authentication' element={ accessToken ? <Navigate to='/training' /> : <AuthenticationPage /> } />
              <Route path='training'>
                  <Route index element={ accessToken ? <TrainingPage /> : <Navigate to='/authentication' /> } />
              </Route>
          </Routes>
      </Router>
  );
}

export default App;
