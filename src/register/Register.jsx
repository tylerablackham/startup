import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Register = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    async function registerUser() {
        const response = await fetch('/api/auth/create', {
            method: 'POST',
            body: JSON.stringify({username, password, email}),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
        if (response?.status !== 200) {
            const body = await response.json()
            alert(`Error: ${body.msg}`)
        }
        else {
            const { token } = await response.json()
            sessionStorage.setItem('authToken', token)
            onLogin(username)
            navigate('/transfers')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        console.log('Attempting register')
        await registerUser()
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
