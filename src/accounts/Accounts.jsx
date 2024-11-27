// src/components/Accounts.jsx
import React, {useEffect, useState} from 'react';
import './Accounts.css';
import {useNavigate} from "react-router-dom";

const Accounts = () => {
    // State variables to track connection status
    const [appleMusicConnected, setAppleMusicConnected] = useState(false);
    const [appleMusicUsername, setAppleMusicUsername] = useState("username123"); // Replace with actual username if available
    const [spotifyConnected, setSpotifyConnected] = useState(false); // Assuming Spotify is connected for example purposes
    const [spotifyUsername, setSpotifyUsername] = useState("username123"); // Replace with actual username if available
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        if (code) {
            (async () => {
                try {
                    const response = await fetch(`/api/spotify/access`, {
                        method: 'POST',
                        body: JSON.stringify({ code: code }),
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    })
                    if (response.ok) {
                        const { displayName } = await response.json()
                        setSpotifyConnected(true)
                        setSpotifyUsername(displayName)
                    } else {
                        alert("Error connecting Spotify")
                    }
                } catch (e) {
                    console.error('Error handling Spotify callback:', error)
                    alert("Error connecting Spotify")
                } finally {
                    navigate('/accounts', { replace: true });
                }
            })()
        }
    }, [location.search, navigate])

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/spotify/access`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            if (response.ok) {
                const { displayName } = await response.json()
                setSpotifyConnected(true)
                setSpotifyUsername(displayName)
            }
        })()
    },[])

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
        window.location.href = '/api/spotify/connect'
    }

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
