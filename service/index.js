import express from 'express'
import * as uuid from "uuid"
import axios from 'axios'
import querystring from 'querystring'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost:4000/api/spotify/callback'

let users = {
    'tyler': {
        username: 'tyler',
        password: 'pass',
        email: 'email@tyler.com',
        sessionToken: 0,
        spotifyAccessToken: null,
        spotifyRefreshToken: null
    }
}
let numUsers = 0

const port = process.argv.length > 2 ? process.argv[2] : 4000

app.use(express.json())
app.use(express.static('public'))

var apiRouter = express.Router()
app.use(`/api`, apiRouter)

apiRouter.get('/auth/numUsers', async (req, res) => {
    res.send({numUsers: numUsers})
})

apiRouter.post('/auth/create', async (req, res) => {
    const user = users[req.body.username]
    if (user) {
        res.status(409).send({ msg: 'Existing username' })
    } else {
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            sessionToken: uuid.v4() }
        users[user.username] = user
        numUsers += 1
        res.send({ sessionToken: user.sessionToken })
    }
})

apiRouter.post('/auth/login', async (req, res) => {
    const user = users[req.body.username]
    if (user) {
        if (req.body.password === user.password) {
            user.sessionToken = uuid.v4()
            res.send({ sessionToken: user.sessionToken })
            return
        }
    }
    res.status(401).send({msg: 'Invalid username or password'})
})

apiRouter.delete('/auth/logout', async (req, res) => {
    const user = Object.values(users).find((u) => u.sessionToken === req.body.sessionToken)
    if (user) {
        delete user.sessionToken
    }
    res.status(204).end()
})

apiRouter.get('/spotify/connect', (req, res) => {
    const scopes = 'playlist-read-private playlist-read-collaborative'
    const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scopes,
    })}`
    res.redirect(authURL)
})

apiRouter.get('/spotify/callback', async (req, res) => {
    const { code } = req.query

    if (!code) {
        return res.status(400).send('Authorization code is missing')
    }

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        }), {
            headers: {
                'Authorization': `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        const accessToken = tokenResponse.data.access_token
        const refreshToken = tokenResponse.data.refresh_token
        const expiresIn = tokenResponse.data.expires_in
        const expirationDate = Date.now() + expiresIn * 1000

        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const username = response.data.display_name;

        res.send({
            accessToken,
            refreshToken,
            expirationDate,
            username
        })
    } catch (e) {
        console.error('Error exchanging code for tokens: ', e)
        res.status(500).send('Failed to exchange authorization code for tokens')
    }
})

apiRouter.post('/spotify/tokens', async (req, res) => {
    const { sessionToken, accessToken, refreshToken, expirationDate } = req.body
    const user = Object.values(users).find((u) => u.sessionToken === sessionToken)
    if (user) {
        user.spotifyAccessToken = accessToken
        user.spotifyRefreshToken = refreshToken
        user.spotifyExpirationDate = expirationDate
        res.status(200).end()
    }
    else {
        res.status(404).send('Failed to find user')
    }
})

apiRouter.get('/spotify/playlists', async (req, res) => {
    const sessionToken = req.headers['sessionToken']
    const user = Object.values(users).find((u) => u.sessionToken === sessionToken)
    if (user) {
        await refreshSpotifyAccessTokenIfNeeded(user.username)
        const accessToken = user.spotifyAccessToken
        let playlists = []
        let url = 'https://api.spotify.com/v1/me/playlists'

        while (url) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                // Add the current page's playlists to the array
                playlists = playlists.concat(response.data.items)

                // Check if there's a next page
                url = response.data.next
            } catch (error) {
                console.error('Error fetching playlists:', error)
                res.status(500).send('Failed to fetch playlists')
            }
        }
        res.json({playlists})
    } else {
        res.status(404).send('Failed to find user with session token')
    }
})

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

async function refreshSpotifyAccessTokenIfNeeded(username) {
    const user = users[username]
    const now = Date.now();
    if (user.spotifyExpirationDate && now > user.spotifyExpirationDate - 5 * 60 * 1000) { // Refresh 5 minutes before expiration
        console.log('Access token is about to expire, refreshing...');
        try {
            const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }), {
                headers: {
                    'Authorization': `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            user.spotifyAccessToken = tokenResponse.data.access_token;
            user.spotifyExpirationDate = Date.now() + (tokenResponse.data.expires_in * 1000); // Update expiration time

            console.log('Access token refreshed');
        } catch (error) {
            console.error('Error refreshing access token:', error);
        }
    }
}