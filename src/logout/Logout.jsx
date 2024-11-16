import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = ({ onLogout }) => {
    const navigate = useNavigate()

    useEffect(() => {
        async function handleLogout() {
            const sessionToken = sessionStorage.getItem('sessionToken')
            if (sessionToken) {
                try {
                    // Call the logout API
                    await fetch('/api/auth/logout', {
                        method: 'DELETE',
                        body: JSON.stringify({ sessionToken }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                } catch (error) {
                    console.error('Logout failed:', error)
                }
            }

            // Clear the token from storage regardless of API call success
            sessionStorage.removeItem('sessionToken')

            // Redirect immediately
            navigate('/login')
            onLogout()
        }

        handleLogout()
    }, [navigate])

    return null // No UI needed
};

export default Logout
