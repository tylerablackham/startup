import {useEffect, useState} from 'react';
import './Transfers.css';
import {useNavigate} from "react-router-dom";

const Transfers = () => {
    // Mock data for playlists and songs - replace with real data from your database/API
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState("Playlist 1");
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await fetch('/api/spotify/playlists', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const { playlists } = await response.json()
                setPlaylists(JSON.parse(playlists))
            }
        })()
    },[])

    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/accounts')
    }

    const handleNewTransfer = () => {
        alert("Starting a new transfer...");
        // Add logic here to create a new transfer
    };

    const handleUpdateTransfer = () => {
        alert("Updating the transfer...");
        // Add logic here to update the transfer
    };

    const handlePlaylistSelect = async (playlistName, tracksHref) => {
        setSelectedPlaylist(playlistName);
        const response = await fetch(`/api/spotify/songs?tracksHref=${tracksHref}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response.status)
        if (response.ok) {
            const {songs} = await response.json()
            setSongs(JSON.parse(songs))
        }
    };

    return (
        <main>
            <h1>Transfers</h1>

            <form onSubmit={handleSubmit}>
                <div className="Transfers">
                    <div className="Playlists">
                        <h2>Playlists</h2>
                        <div>
                            <ul>
                                {playlists.map((playlist, index) => (
                                    <li key={index} onClick={() => handlePlaylistSelect(playlist.name, playlist.tracksHref)}>
                                        {playlist.name}
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
                                    <li key={index}>{song.name}</li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={handleUpdateTransfer}>Update Transfer</button>
                    </div>
                </div>

                <div className="ToAccounts">
                    <button type="submit">
                        Connect Accounts
                    </button>
                </div>
            </form>
        </main>
    );
};

export default Transfers;
