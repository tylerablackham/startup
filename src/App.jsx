import './App.css'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Login from "./login/Login.jsx"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import Register from "./register/Register.jsx"
import Transfers from "./transfers/Transfers.jsx"
import Accounts from "./accounts/Accounts.jsx"
import {useEffect, useState} from "react"
import Logout from "./logout/Logout.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true);
    const handleAuthenticated = (username) => {
        setIsLoggedIn(true)
        setUsername(username)
    }
    const handleUnauthenticated = () => {
        setIsLoggedIn(false)
        setUsername('')
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch('/api/auth/validate', {
                    method: 'GET',
                    credentials: 'include', // Ensure the cookie is sent with the request
                });

                if (response.ok) {
                    const data = await response.json();
                    handleAuthenticated(data.username); // Set user info
                } else {
                    handleUnauthenticated(); // Clear user info if not authenticated
                }
            } catch (error) {
                console.error('Error during authentication check:', error);
                handleUnauthenticated(); // Clear user info on error
            } finally {
                setLoading(false); // Mark authentication check as complete
            }
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Optional loading state while checking auth
    }

    return (
        <BrowserRouter>
            <div>
                <Header isLoggedIn={isLoggedIn} username={username}/>
                <main>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isLoggedIn ? <Navigate to="/transfers" /> : <Navigate to="/login" />
                            }
                        />
                        <Route path="/login" element={<Login onLogin={handleAuthenticated} />} />
                        <Route path="/register" element={<Register onLogin={handleAuthenticated} />} />
                        <Route path="/transfers" element={isLoggedIn ? <Transfers /> : <Navigate to="/login" />} />
                        <Route path="/accounts" element={isLoggedIn ? <Accounts /> : <Navigate to="/login" />} />
                        <Route path="/logout" element={<Logout onLogout={handleUnauthenticated} />} />
                        <Route path="*" element={<Navigate to="/login" />}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </BrowserRouter>
    )
}

export default App
