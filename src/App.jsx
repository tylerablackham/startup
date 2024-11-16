import './App.css'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Login from "./login/Login.jsx"
import {Navigate, Route, Routes} from "react-router-dom"
import Register from "./register/Register.jsx"
import Transfers from "./transfers/Transfers.jsx"
import Accounts from "./accounts/Accounts.jsx"
import {useState} from "react"
import Logout from "./logout/Logout.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const handleAuthenticated = (username) => {
        setIsLoggedIn(true)
        setUsername(username)
    }
    const handleUnauthenticated = () => {
        setIsLoggedIn(false)
        setUsername('')
    }

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} username={username}/>
            <main>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleAuthenticated} />} />
                    <Route path="/register" element={<Register onLogin={handleAuthenticated} />} />
                    <Route path="/transfers" element={isLoggedIn ? <Transfers /> : <Navigate to="/login" />} />
                    <Route path="/accounts" element={isLoggedIn ? <Accounts /> : <Navigate to="/login" />} />
                    <Route path="/logout" element={<Logout onLogout={handleUnauthenticated} />} />
                    <Route path="/" element={<Navigate to="/login" />}/>
                    <Route path="*" element={<Navigate to="/login" />}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
