import { Link } from "react-router-dom"
import {useEffect, useState} from "react";


const Header = ({ isLoggedIn, username }) => {
    const [numUsers, setNumUsers] = useState(0);

    useEffect(() => {

        (async () => {
            const response = await fetch('/api/auth/numUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                }
            })
            if (response.ok) {
                const { numUsers } = await response.json()
                setNumUsers(await numUsers)
            }
        })()

        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const ws = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

        ws.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'updateNumUsers') {
                console.log("Updating numUsers:", data.numUsers);
                setNumUsers(data.numUsers);
            }
        };

        ws.onclose = () => {
            console.warn('WebSocket closed');
        };

        return () => ws.close();
    }, []);

    return (<header>
        <div>
            <div className="Title">
                <img alt="Tune Transfer Logo" src="https://raw.githubusercontent.com/tylerablackham/startup/main/favicon.ico" width="50"/>
                <h1>TuneTransfer<sup>&reg;</sup> <br/>{numUsers} Users!</h1>
            </div>
        </div>
        <nav>
            <menu>
                {isLoggedIn ? (
                    <>
                        <li>Welcome, {username}!</li>
                        <li><Link to="/transfers">Transfers</Link></li>
                        <li><Link to="/accounts">Accounts</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </menu>
        </nav>
    </header>)
}

export default Header