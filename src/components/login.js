import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigation

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("Login response:", data); // Debugging

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role); // Save role
        console.log("User role:", localStorage.getItem("role"));

        // Redirect based on role
        if (data.user.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/home");
        }
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
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
