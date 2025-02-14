import './App.css';
import DashBoard from './pages/Dashboard';
import Login from './pages/Login';
import Header from './components/Header';
import Register from './pages/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">

      <Router>
      <Header />

      <header className="App-header">
        <Routes>
            <Route path='/dashboard' element={<DashBoard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes> 
      </header>

      </Router>
    </div>

  );
}

export default App;
