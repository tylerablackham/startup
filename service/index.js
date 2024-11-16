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
            token: uuid.v4() }
        users[user.username] = user
        numUsers += 1
        res.send({ token: user.token })
    }
})

apiRouter.post('/auth/login', async (req, res) => {
    const user = users[req.body.username]
    if (user) {
        if (req.body.password === user.password) {
            user.token = uuid.v4()
            res.send({ token: user.token })
            return
        }
    }
    res.status(401).send({msg: 'Invalid username or password'})
})

apiRouter.delete('/auth/logout', async (req, res) => {
    const user = Object.values(users).find((u) => u.token === req.body.token)
    if (user) {
        delete user.token
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
    });

    const accessToken = tokenResponse.data.access_token

    // Use the access token to fetch playlists
    try {
        const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const playlists = playlistsResponse.data.items;
        res.json({ playlists });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).send('Failed to fetch playlists')
    }
})

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})