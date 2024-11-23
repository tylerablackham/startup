// src/components/Accounts.jsx
import React, { useState } from 'react';
import './Accounts.css';
import {useNavigate} from "react-router-dom";

const Accounts = () => {
    // State variables to track connection status
    const [appleMusicConnected, setAppleMusicConnected] = useState(false);
    const [appleMusicUsername, setAppleMusicUsername] = useState("username123"); // Replace with actual username if available
    const [spotifyConnected, setSpotifyConnected] = useState(false); // Assuming Spotify is connected for example purposes
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

    const handleSpotifyConnect = async () => {
        const connectionResponse = await fetch('/api/spotify/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
        const {accessToken, refreshToken, expirationDate, username} = await connectionResponse.json()
        await fetch('/api/spotify/token', {
            method: 'POST',
            body: JSON.stringify({accessToken, refreshToken, expirationDate}),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })

        setSpotifyConnected(true)
        setSpotifyUsername(username) // Update with actual username after connecting
        alert("Spotify connected!")
    };

    return (
        <main>
            <h1>Connect Streaming Accounts</h1>

            <form onSubmit={handleSubmit}>
                <div className="Music">
                    <div className="AppleMusic">
                        <img alt="Apple Music Logo" src="https://raw.githubusercontent.com/tylerablackham/startup/main/apple_music_logo.png"/>
                        <button type="button" onClick={handleAppleMusicConnect}>
                            {appleMusicConnected ? "Change Connection" : "Connect Apple Music"}
                        </button>
                        <p>{appleMusicConnected ? `Connected As: ${appleMusicUsername}` : "Not Connected"}</p>
                    </div>

                    <div className="Spotify">
                        <img alt="Spotify Logo" src="https://raw.githubusercontent.com/tylerablackham/startup/main/spotify_logo.png"/>
                        <button type="button" onClick={handleSpotifyConnect}>
                            {spotifyConnected ? "Change Connection" : "Connect Spotify"}
                        </button>
                        <p>{spotifyConnected ? `Connected As: ${spotifyUsername}` : "Not Connected"}</p>
                    </div>
                </div>
                <div>
                    <button type="submit">Back to Transfers</button>
                </div>
            </form>
        </main>
    );
};

export default Accounts;
