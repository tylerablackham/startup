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

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} />
            <main>
                <Routes>
                    <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
                    <Route path="/register" element={<Register onLogin={() => setIsLoggedIn(true)} />}/>
                    <Route path="/transfers" element={<Transfers/>}/>
                    <Route path="/accounts" element={<Accounts/>}/>
                    <Route path="/" element={<Navigate to="/login" />}/>
                    <Route path="*" element={<Navigate to="/login" />}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
