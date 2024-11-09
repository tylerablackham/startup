import React, { useState } from 'react';
import './Transfers.css';

const Transfers = () => {
    // Mock data for playlists and songs - replace with real data from your database/API
    const [playlists, setPlaylists] = useState([
        "Playlist 1", "Playlist 2", "Playlist 3", "Playlist 4"
    ]);
    const [selectedPlaylist, setSelectedPlaylist] = useState("Playlist 1");
    const [songs, setSongs] = useState([
        "Song 1", "Song 2", "Song 3", "Song 4", "Song 5", "Song 6"
    ]);

    const handleNewTransfer = () => {
        alert("Starting a new transfer...");
        // Add logic here to create a new transfer
    };

    const handleUpdateTransfer = () => {
        alert("Updating the transfer...");
        // Add logic here to update the transfer
    };

    const handlePlaylistSelect = (playlist) => {
        setSelectedPlaylist(playlist);
        // Fetch songs for the selected playlist if you’re using a database
    };

    return (
        <main>
            <h1>Transfers</h1>

            <form>
                <div className="Transfers">
                    <div className="Playlists">
                        <h2>Playlists</h2>
                        <div>
                            <ul>
                                {playlists.map((playlist, index) => (
                                    <li key={index} onClick={() => handlePlaylistSelect(playlist)}>
                                        {playlist}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={handleNewTransfer}>New Transfer</button>
                    </div>

                    <div className="Songs">
                        <h2>{selectedPlaylist}</h2>
                        <div>
                            <ul>
                                {songs.map((song, index) => (
                                    <li key={index}>{song}</li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={handleUpdateTransfer}>Update Transfer</button>
                    </div>
                </div>

                <div className="ToAccounts">
                    <button onClick={() => window.location.href = "/accounts"}>
                        Connect Accounts
                    </button>
                </div>
            </form>
        </main>
    );
};

export default Transfers;
