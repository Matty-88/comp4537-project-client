import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const SERVER_RENDER = "https://comp4537-project-server.onrender.com";


const Home = ({handleLogout}) => {
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
            const response = await fetch(`${SERVER_RENDER}/generate-music`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            if (data.file) {
                setAudioUrl(`${SERVER_RENDER}/${data.file}`);
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

    const handleLogout1 = async () => {
        try {
            await fetch(`${SERVER_RENDER}/logout`, {
                method: "POST"
               
            });
            
            handleLogout();
           
        } catch (error) {
            console.error("Logout failed:", error);
        }
        
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="mb-3">Generate AI Music</h1>

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

            <button className="btn btn-danger mt-4" onClick={handleLogout1}>
                Logout
            </button>
        </div>
    );
};

export default Home;
