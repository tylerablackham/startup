// import { useState } from 'react'
import './App.css'
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./login/Login.jsx";

function App() {
// const [count, setCount] = useState(0)

    return (
        <div>
            <Header />
            <main>
                <Login/>
            </main>
            <Footer/>
        </div>
    )
}

export default App
