import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "bootstrap/dist/css/bootstrap.min.css";
import messages from "../components/messages";


const SERVER_RENDER = "https://newservercomp4something.onrender.com/v1";

//prop login
const LoginPage = ({onLogin}) => {

    //stores user input for email and password
    const [formData, setFormData] = useState({ email: "", password: "" });

    //login error messages
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    //e that triggers the function when user types 
    const handleChange = (e) => {
        //keeps the existing values of formData instead of overwriteing it ...
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //when user clicks login
    const handleSubmit = async (e) => {
    //prevents the page from being refereeshed so we can handle with javascript
    e.preventDefault();

    //clears prev error
    setError("");
    setLoading(true);

    try {
        const response = await fetch(`${SERVER_RENDER}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Include cookies in the request
            body: JSON.stringify(formData),
        });

        //converts respons into javascript object
        const data = await response.json();
   

        if (!response.ok) {
            throw new Error(data.error || messages.loginFailed);
        }

        //store token in local storage to keep user loggin in after refresh
        localStorage.setItem("token", data.token);


        localStorage.setItem("role", data.user.role); // Save role
       

        // marks as logged in
        //sotre role
        //redirects 
       onLogin(); 
    } catch (err) {
        console.error("Login error:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


  
    

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <button
                        className="btn btn-link mt-3"
                        onClick={() => navigate("/register")}
                        >
                        Don't have an account? Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
