import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Home from './components/home';
import LoginPage from './components/login';
import AdminPage from './components/admin';

function App() {
    const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role") || "user"); // Default to "user" if not found
    const navigate = useNavigate(); // Use navigate for redirection

    const handleLogin = (token, userRole) => {
     
        
        setAuthenticated(true);
        setRole(localStorage.getItem("role")); // Use userRole directly, not localStorage.getItem("role")

        console.log("Token:", localStorage.getItem("token"));
        console.log("Role:", localStorage.getItem("role"));

        // Redirect admin users immediately
        if (token && userRole === "admin") {
            navigate("/admin");
        } else {
            navigate("/home"); // Redirect normal users to home
        }
    };

    useEffect(() => {
        console.log("Current Role:", role);
    }, [role]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuthenticated(false);
        setRole("user");
        navigate("/"); // Redirect to login after logout
    };

    return (

            <Routes>
                {/* Redirect logged-in users to home or admin */}
                <Route path="/" element={authenticated ? <Navigate to={role === "admin" ? "/admin" : "/home"} /> : <LoginPage onLogin={handleLogin} />} />
                
                {/* Admin route - Only accessible to admins */}
                <Route path="/admin" element={authenticated && role === "admin" ? <AdminPage handleLogout={handleLogout} /> : <Navigate to="/" />} />
                
                {/* Home route - Accessible to authenticated users */}
                <Route path="/home" element={authenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />} />

                {/* Catch all unmatched routes */}
                <Route path="*" element={<h1>404: Not Found</h1>} />
            </Routes>

    );
}

export default App;