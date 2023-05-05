import './App.css';
import './components/auth'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth';
import ProfilePage from './components/profile';

function App() {
  return (
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
    );
}

export default App;
