import React, { useState } from 'react';
import './Login.css'; // Optional: Add a CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Logging in with:', { username, password });
    };

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
                    <p>Don&#39;t have an account? <a href="/register">Register Here</a></p>
                </div>
            </form>
        </main>
    );
};

export default Login;
