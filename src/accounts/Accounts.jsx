// src/components/Accounts.jsx
import React, { useState } from 'react';
import './Accounts.css';
import {useNavigate} from "react-router-dom";

const Accounts = () => {
    // State variables to track connection status
    const [appleMusicConnected, setAppleMusicConnected] = useState(false);
    const [appleMusicUsername, setAppleMusicUsername] = useState("username123"); // Replace with actual username if available
    const [spotifyConnected, setSpotifyConnected] = useState(true); // Assuming Spotify is connected for example purposes
    const [spotifyUsername, setSpotifyUsername] = useState("username123"); // Replace with actual username if available

    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/transfers')
    }

    const handleAppleMusicConnect = () => {
        // Placeholder for actual Apple Music connection logic
        setAppleMusicConnected(true);
        setAppleMusicUsername("username123");
        alert("Apple Music connected!");
    };

    const handleSpotifyConnect = () => {
        // Placeholder for actual Spotify connection logic
        setSpotifyConnected(true);
        setSpotifyUsername("example_user"); // Update with actual username after connecting
        alert("Spotify connected!");
    };

    return (
        <main>
            <div>
                <h1>Connect Streaming Accounts</h1>

                <form onSubmit={handleSubmit}>
                    <div className="Music">
                        <div className="AppleMusic">
                            <img alt="Apple Music Logo" src="icons/apple_music_logo.png"/>
                            <button onClick={handleAppleMusicConnect}>
                                {appleMusicConnected ? "Connected" : "Connect Apple Music"}
                            </button>
                            <p>{appleMusicConnected ? `Connected As: ${appleMusicUsername}` : "Not Connected"}</p>
                        </div>

                        <div className="Spotify">
                            <img alt="Spotify Logo" src="icons/spotify_logo.png"/>
                            <button onClick={handleSpotifyConnect}>
                                {spotifyConnected ? "Connected" : "Connect Spotify"}
                            </button>
                            <p>{spotifyConnected ? `Connected As: ${spotifyUsername}` : "Not Connected"}</p>
                        </div>
                    </div>
                    <div>
                        <button type="submit">Back to Transfers</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Accounts;
