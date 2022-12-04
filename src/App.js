import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import AuthenticationPage from "./pages/AuthenticationPage";
import TrainingPage from "./pages/TrainingPage";


const App = () => {
  return (
      <Router>
          <Routes>
              <Route path='/authentication' element={<AuthenticationPage />} />
              <Route path='/training' element={<TrainingPage />} />
          </Routes>
      </Router>
  );
}

export default App;
