import { Link } from "react-router-dom"

const Header = ({ isLoggedIn, username }) => (
    <header>
        <div>
            <div className="Title">
                <img alt="Tune Transfer Logo" src="icons/favicon.ico" width="50"/>
                <h1>TuneTransfer<sup>&reg;</sup></h1>
            </div>
        </div>
        <nav>
            <menu>
                {isLoggedIn ? (
                    <>
                        <li>Welcome, {username}!</li>
                        <li><Link to="/transfers">Transfers</Link></li>
                        <li><Link to="/accounts">Accounts</Link></li>
                    </>
                ) : (
                    <>
                    <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </menu>
        </nav>
    </header>
)

export default Header