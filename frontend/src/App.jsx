import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './context/authContext';


function App() {
  return (
    <div className="app">

      <Router>
        <AuthProvider>

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth' element={<Authentication />}/>
          </Routes>
        </AuthProvider>
          
    </Router>
    </div>
  );
}

export default App;
