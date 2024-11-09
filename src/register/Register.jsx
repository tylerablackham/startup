import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Register = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        console.log('Registering with:', { username, email, password })
        onLogin(username)
        navigate('/transfers')
    }

    return (
        <main>
            <h1>Register</h1>
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
                    <p><b>Email</b></p>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <div>
                    <p><b>Confirm Password</b></p>
                    <input
                        type="password"
                        placeholder="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
                <div>
                    <p>Already have an account? <Link to="/login">Login Here</Link></p>
                </div>
            </form>
        </main>
    )
}

export default Register
