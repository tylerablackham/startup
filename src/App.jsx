import './App.css'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Login from "./login/Login.jsx"
import {Navigate, Route, Routes} from "react-router-dom"
import Register from "./register/Register.jsx"
import Transfers from "./transfers/Transfers.jsx"
import Accounts from "./accounts/Accounts.jsx"
import {useState} from "react"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const handleLogin = (username) => {
        setIsLoggedIn(true)
        setUsername(username)
    }

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} username={username}/>
            <main>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register onLogin={handleLogin} />} />
                    <Route path="/transfers" element={isLoggedIn ? <Transfers /> : <Navigate to="/login" />} />
                    <Route path="/accounts" element={isLoggedIn ? <Accounts /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to="/login" />}/>
                    <Route path="*" element={<Navigate to="/login" />}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
