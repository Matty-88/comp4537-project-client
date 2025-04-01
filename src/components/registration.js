import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import messages from "../components/messages";


const url = "https://newservercomp4something.onrender.com/v1";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user", 
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(formData.email)) {
            alert(messages.validEmail);
            return;
        }
    
        try {
            const response = await fetch(`${url}/user/add-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error(messages.registrationError, errorData.error);
                return;
            }
    
            alert(messages.registrationSuccess);
            navigate("/");
        } catch (error) {
            console.error(messages.registrationError, error);
            alert(messages.registrationError);
        }
    };
    

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="mb-4">Register</h1>

            <form onSubmit={handleSubmit} className="w-50">
               
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

       
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

             
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
               
                <button type="submit" className="btn btn-primary w-100">
                    Register
                </button>
            </form>

            
            <button
                className="btn btn-link mt-3"
                onClick={() => navigate("/")}
            >
                Already have an account? Login
            </button>
        </div>
    );
};

export default RegisterPage;
