// import { useState } from 'react'
import './App.css'
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./login/Login.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Register from "./register/Register.jsx";
import Transfers from "./transfers/Transfers.jsx";

function App() {
// const [count, setCount] = useState(0)

    return (
        <div>
            <Header />
            <main>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/transfers" element={<Transfers/>}/>
                    <Route path="/" element={<Navigate to="/login" />}/>
                </Routes>
            </main>
            <Footer/>
        </div>
    )
}

export default App
