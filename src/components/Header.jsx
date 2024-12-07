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