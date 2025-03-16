import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Home from './components/home';
import LoginPage from './components/login';

function App() {
    const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));

    const handleLogin = (token) => {
        localStorage.setItem("token", token);
        setAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthenticated(false);
    };

    useEffect(() => {
        setAuthenticated(!!localStorage.getItem("token"));
    }, []);

    return (
        <Routes>
            <Route path="/" element={!authenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/home" />} />
            <Route path="/home" element={authenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
    );
}

export default App;
