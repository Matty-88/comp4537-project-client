import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/home';
import LoginPage from './components/login';

function App() {
  return (
    <>
      

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>
    </>

  );
}

export default App;
