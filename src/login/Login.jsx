import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function loginUser() {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
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
        if (!username || !password) {
            alert('Both fields are required!')
            return
        }
        console.log('Attempting login')
        await loginUser()
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
