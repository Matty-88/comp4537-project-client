import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const SERVER_RENDER = "https://newservercomp4something.onrender.com";


const Home = ({handleLogout}) => {
    const [prompt, setPrompt] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [apiCalls, setApiCalls] = useState(null);
    const [error, setError] = useState("");
    

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${SERVER_RENDER}/profile`, {
                    method: "GET",
                    credentials: "include",
                });
    
                if (!response.ok) throw new Error("Failed to fetch profile");
    
                const data = await response.json();
                setUser(data.user);
                setApiCalls(data.user.api_calls); // coming from /login or /profile

                // Show alert if user reached 20 API calls
                if (data.user.api_calls >= 20) {
                    alert("You have reached your limit of 20 free API calls.");
                }

            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Could not load user info.");
            }
        };
    
        fetchProfile();
    }, []);





    


    

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

            if (!response.ok) {
                const errorText = await response.text(); // Catch non-JSON errors like HTML
                throw new Error("Music generation failed: " + errorText);
              }
          
              const audioBlob = await response.blob();
              const audioUrl = URL.createObjectURL(audioBlob);
              setAudioUrl(audioUrl);
          
            } catch (error) {
              console.error("Music generation error:", error);
              alert("Music generation failed: " + error.message);
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

            {user && (
            <div className="mb-3 text-center">
                <h4>Welcome, {user.name}!</h4>
                <p>You have used <strong>{apiCalls}</strong> out of 20 free API calls.</p>
            </div>
            )}
            {error && <p className="text-danger">{error}</p>}


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
