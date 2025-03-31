import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import messages from "../components/messages";

//state is object that holds data about a component, allows components to remember into across renders

const SERVER_RENDER = "https://newservercomp4something.onrender.com/v1";

//prop is passed from parent 
const AdminPage = ({ handleLogout }) => {

    //allows components to manage state = useState
    //stores user input, updtaes
    const [prompt, setPrompt] = useState("");

    //url of generated audio
    const [audioUrl, setAudioUrl] = useState(null);


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [apiStats, setApiStats] = useState({ endpointStats: [], userStats: [] });
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchApiStats = async () => {
            try {
                const response = await fetch(`${SERVER_RENDER}/admin/api-usage-summary`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error(messages.apiFetchFail);
                const data = await response.json();
                setApiStats(data);
            } catch (err) {
                console.error(messages.apiFetchFail, err);
                setError(messages.noAPILoad);
            }
        };
    
        fetchApiStats();
    }, []);


        // PUT method
        const updateUser = async () => {
            try {
                const response = await fetch(`${SERVER_RENDER}/user/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ name, email }),
                });
        
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText);
                }
        
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error(error);
                alert("Update failed: " + error.message);
            }
        };

        // PATCH method
        const patchUserName = async () => {
            try {
                const response = await fetch(`${SERVER_RENDER}/user/${userId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ name }),
                });
        
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText);
                }
        
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error(error);
                alert(messages.patchFail + error.message);
            }
        };

        const deleteUser = async () => {
            try {
                const response = await fetch(`${SERVER_RENDER}/user/${userId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
        
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText);
                }
        
                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error(messages.deleteFail, error);
                alert(messages.deleteFail + error.message);
            }
        };
        
    
    


    //send request to generate music 
    const handleGenerateMusic = async () => {
        try {
            if (!prompt) return;
    
            //http request
            const response = await fetch(`${SERVER_RENDER}/generate-music`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
    
            if (!response.ok) throw new Error(messages.musicGenerationError);
    
            //converts server repsonts into binary object (blob), represents audio/ video/ images that can be handles by browser
            const audioBlob = await response.blob();

            //creates temp url that points to the blob sotred in memory, dont need to save the audio file, plays it in browser 
            const audioUrl = URL.createObjectURL(audioBlob);
            
            setAudioUrl(audioUrl);
    
            // Optionally play audio immediately
            const audio = new Audio(audioUrl);
            // audio.play();
    
        } catch (error) {
            console.error(messages.musicGenerationError, error);
        }
    };
    

    const logout = () => {
        handleLogout();
    };

    return (
        <div className="container py-5" style={{ maxHeight: "100vh", overflowY: "auto" }}>
            <div className="text-center mb-4">
                <h1>Admin Dashboard - AI Music Generator</h1>
            </div>
    
            {/* Music Generation Section */}
            <div className="mb-5 d-flex flex-column align-items-center">
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Describe the music..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
    
                <button
                    className="btn btn-primary"
                    onClick={handleGenerateMusic}
                    disabled={loading}
                >
                    {loading ? messages.generating : messages.genMusic}
                </button>
    
                {audioUrl && (
                    <audio controls className="mt-3">
                        <source src={audioUrl} type="audio/wav" />
                        Your browser doesn't support audio playback.
                    </audio>
                )}
            </div>
    
            {/* API Usage Stats */}
            <div className="mb-5">
                <h2 className="text-center">API Usage Stats</h2>
                {error && <p className="text-danger text-center">{error}</p>}
    
                <div className="d-flex flex-wrap gap-5 justify-content-center">
                    {/* Endpoint Stats Table */}
                    <div>
                        <h4>Requests Per Endpoint</h4>
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>Method</th>
                                    <th>Endpoint</th>
                                    <th>Requests</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiStats.endpoints?.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.method}</td>
                                        <td>{row.endpoint}</td>
                                        <td>{row.total_requests}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
    
                    {/* User Stats Table */}
                    <div>
                        <h4>User API Consumption</h4>
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Total Requests</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiStats.users?.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.name}</td>
                                        <td>{row.email}</td>
                                        <td>{row.total_requests}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
            {/* Update User Section */}
            <div className="mb-5 d-flex flex-column align-items-center">
                <h2>Update User</h2>
                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="New Email (for PUT only)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
                <div>
                    <button className="btn btn-warning me-2" onClick={updateUser}>
                        Update User (PUT)
                    </button>
                    <button className="btn btn-secondary" onClick={patchUserName}>
                        Update Name Only (PATCH)
                    </button>
                    <button className="btn btn-danger mt-2" onClick={deleteUser}>
                        Delete User
                    </button>

                </div>
            </div>
    
            {/* Logout */}
            <div className="text-center">
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
    
};

export default AdminPage;
