import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = ({ onLogout }) => {
    const navigate = useNavigate()

    useEffect(() => {
        async function handleLogout() {
            try {
                // Call the logout API
                await fetch('/api/auth/logout', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            } catch (error) {
                console.error('Logout failed:', error)
            }
            // Redirect immediately
            navigate('/login')
            onLogout()
        }

        handleLogout()
    }, [navigate])

    return null // No UI needed
};

export default Logout
