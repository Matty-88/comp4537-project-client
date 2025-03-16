import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPage = ({ handleLogout }) => {
    const [prompt, setPrompt] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerateMusic = async () => {
        if (!prompt) {
            alert("Please enter a description for the music.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/generate-music", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            if (data.file) {
                setAudioUrl(`http://localhost:5001/${data.file}`);
            } else {
                alert("Music generation failed.");
            }
        } catch (error) {
            console.error("Music generation error:", error);
            alert("Error generating music.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        handleLogout();
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="mb-3">Admin Dashboard - AI Music Generator</h1>
           

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Describe the music..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ width: "400px" }}
            />

            <button
                className="btn btn-primary mb-3"
                onClick={handleGenerateMusic}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Music"}
            </button>

            {audioUrl && (
                <audio controls className="mt-3">
                    <source src={audioUrl} type="audio/wav" />
                    Your browser doesn't support audio playback.
                </audio>
            )}

            <button className="btn btn-danger mt-4" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default AdminPage;
