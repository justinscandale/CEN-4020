import logo from './logo.svg';
import './App.css';
import DashBoard from './pages/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      
      <header className="App-header">
        
        <DashBoard />

      </header>
    </div>
  );
}

export default App;
