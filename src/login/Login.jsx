import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Logging in with:', { username, password })
        // Simulate login success
        onLogin()
        navigate('/transfers')
    }

    return (
        <main>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <p><b>Username</b></p>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <p><b>Password</b></p>
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
                <div>
                    <p>Don&#39;t have an account? <Link to="/register">Register Here</Link></p>
                </div>
            </form>
        </main>
    )
}

export default Login
