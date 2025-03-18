import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SERVER_RENDER = "https://newservercomp4something.onrender.com";

const AdminPage = ({ handleLogout }) => {
    const [prompt, setPrompt] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerateMusic = async () => {
        try {
            if (!prompt) return;
    
            const response = await fetch(`${SERVER_RENDER}/generate-music`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
    
            if (!response.ok) throw new Error('Failed to generate audio.');
    
            // Directly handle audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            setAudioUrl(audioUrl);
    
            // Optionally play audio immediately
            const audio = new Audio(audioUrl);
            // audio.play();
    
        } catch (error) {
            console.error("Music generation error:", error);
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
