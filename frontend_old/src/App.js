import './App.css';
import DashBoard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ReviewReceipts from './pages/ReviewReceipts'; // Import the new component
import Header from './components/Header';
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
            <Route path='/receipts' element={<ReviewReceipts />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
