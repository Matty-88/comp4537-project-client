import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"; //state stores auth and role status, effect is for logging
import Home from './components/home';
import LoginPage from './components/login';
import AdminPage from './components/admin';
import RegisterPage from "./components/registration";


//core component. manages authentication/ routing/ nav logic/ decide what ocmponent to show bason on user authentication

//main component, comps are building blocks of ui, strucutres the whole app
function App() {

    //creates a state varible that tracks user logged in
    //useState() initialize authenticated based on whether a token exitsts in local storage, if token exists it's true
    const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));

    //stores users roll admin or default user 
    const [role, setRole] = useState(localStorage.getItem("role") || "user"); 

    //stores navigation function for routing
    const navigate = useNavigate(); 

    //token received after loggin in
    const handleLogin = (token, userRole) => {
     
        //marks user as logged in by updating state variable
        setAuthenticated(true);

        //change from local storage in the future 
        setRole(localStorage.getItem("role")); 

        console.log("Token:", localStorage.getItem("token"));
        console.log("Role:", localStorage.getItem("role"));

        // Redirect admin users immediately
        if (token && userRole === "admin") {
            navigate("/admin");
        } else {
            navigate("/home"); // Redirect normal users to home
        }
    };

    //whenever role is changed, for debugging
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

            //checks url and renders the route
            <Routes>
                {/* Redirect logged-in users to home or admin 
                element determines what gets rendered/ if auth is true check the role */}
                <Route path="/" element={authenticated ? <Navigate to={role === "admin" ? "/admin" : "/home"} /> : <LoginPage onLogin={handleLogin} />} />
                
                {/* Admin route - Only accessible to admins */}
                {/* Admin route - Only accessible to admins passes logout function */}
                <Route path="/admin" element={authenticated && role === "admin" ? <AdminPage handleLogout={handleLogout} /> : <Navigate to="/" />} />
                
                {/* Home route - Accessible to authenticated users */}
                <Route path="/home" element={authenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />} />

                <Route path="/register" element={<RegisterPage />} />


                {/* Catch all unmatched routes */}
                <Route path="*" element={<h1>404: Not Found</h1>} />
            </Routes>

    );
}

export default App;