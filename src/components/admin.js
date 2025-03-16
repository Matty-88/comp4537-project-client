import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role"); // Clear role
        navigate("/");
    };

    return (
        <div className="container text-center vh-100 d-flex flex-column align-items-center justify-content-center">
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin! You have full access to the system.</p>
            <button className="btn btn-danger mt-4" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminPage;
