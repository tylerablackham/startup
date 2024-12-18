import express from 'express'
import * as uuid from 'uuid'
import axios from 'axios'
import querystring from 'querystring'
import * as bcrypt from 'bcrypt'
import * as DB from './database.js'
import cookieParser from 'cookie-parser'

const authCookieName = 'token'
const app = express()

import { readFile } from 'fs/promises';
import { peerProxy } from "./peerProxy.js";
const filePath = new URL('./env.json', import.meta. url);
const contents = await readFile(filePath, { encoding: 'utf8' })
const env = JSON.parse(contents);

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = env.SPOTIFY_REDIRECT_URI
let numUsers = await DB.getNumUsers()

const port = process.argv.length > 2 ? process.argv[2] : 4000

app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.set('trust proxy', true)

const apiRouter = express.Router();
app.use(`/api`, apiRouter)

const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const { broadcast } = peerProxy(httpService)

apiRouter.get('/auth/numUsers', async (req, res) => {
    res.send({numUsers: numUsers})
})

apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.username)) {
        res.status(409).send({ msg: 'Existing username' });
    } else {
        const user = await DB.createUser(req.body.username, req.body.email, req.body.password);
        setAuthCookie(res, user.token);
        numUsers = await DB.getNumUsers()
        console.log("Broadcasting updateNumUsers:", numUsers); // Debug log
        broadcast({ type: 'updateNumUsers', numUsers });
        res.send({
            id: user._id,
        });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.username)
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token)
            res.send({
                id: user._id
            })
        }
    }
    else {
        res.status(401).send({msg: 'Invalid username or password'})
    }
})

apiRouter.get('/auth/validate', async (req, res) => {
    const authToken = req.cookies[authCookieName]
    const user = await DB.getUserByToken(authToken)
    if (user) {
        res.send({
            username: user.username,
        })
    } else {
        res.status(401).send({ msg: 'Unauthorized' })
    }
})

apiRouter.delete('/auth/logout', async (req, res) => {
    res.clearCookie(authCookieName)
    res.status(204).end()
})

const secureApiRouter = express.Router()
apiRouter.use(secureApiRouter)

secureApiRouter.use(async (req, res, next) => {
    const authToken = req.cookies[authCookieName]
    const user = await DB.getUserByToken(authToken)
    if (user) {
        next()
    } else {
        res.status(401).send({ msg: 'Unauthorized' })
    }
})

secureApiRouter.get('/spotify/connect', (req, res) => {
    const scopes = 'playlist-read-private playlist-read-collaborative'
    const authURL = `https://accounts.spotify.com/authorize?${querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scopes,
    })}`
    res.redirect(authURL)
})

secureApiRouter.post('/spotify/access', async (req, res) => {
    const { code } = req.body
    const authToken = req.cookies[authCookieName]
    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Exchange the code for tokens
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;
        const expiresIn = tokenResponse.data.expires_in;
        const expirationDate = Date.now() + expiresIn * 1000;

        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const displayName = response.data.display_name;
        const user = await DB.getUserByToken(authToken)
        await DB.updateSpotifyConnection(user.username, accessToken, refreshToken, expirationDate, displayName)
        res.send({
            displayName
        })

    } catch (e) {
        console.error('Error exchanging code for tokens: ', e);
        res.status(500).send('Failed to exchange authorization code for tokens');
    }
});

secureApiRouter.get('/spotify/access', async (req, res) => {
    const authToken = req.cookies[authCookieName]
    const user = await DB.getUserByToken(authToken)
    if (user) {
        const connect = await DB.getSpotifyConnection(user.username)
        res.json({
            displayName: connect.displayName
        })
    } else {
        res.status(404).send('Failed to find user')
    }
})

secureApiRouter.get('/spotify/playlists', async (req, res) => {
    const authToken = req.cookies[authCookieName]
    const user = await DB.getUserByToken(authToken)
    if (user) {
        await refreshSpotifyAccessTokenIfNeeded(user.username)
        let playlists = []
        const connection = await DB.getSpotifyConnection(user.username)
        if (connection) {
            let url = 'https://api.spotify.com/v1/me/playlists'
            while (url) {
                try {
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${connection.accessToken}`,
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
        }
        const filteredPlaylists = playlists.map(playlist => ({
            name: playlist.name,
            id: playlist.id,
            tracksHref: playlist.tracks.href,
        }))
        res.json({ playlists: JSON.stringify(filteredPlaylists) })
    } else {
        res.status(404).send('Failed to find user with session token')
    }
})

secureApiRouter.get('/spotify/songs', async (req, res) => {
    const authToken = req.cookies[authCookieName]
    const { tracksHref } = req.query
    const user = await DB.getUserByToken(authToken)
    if (user) {
        await refreshSpotifyAccessTokenIfNeeded(user.username)
        let songs = []
        const connection = await DB.getSpotifyConnection(user.username)
        if (connection) {
            let url = tracksHref;
            while (url) {
                try {
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${connection.accessToken}`,
                        },
                    });

                    // Extract songs from the current page
                    songs = songs.concat(response.data.items);

                    // Proceed to the next page if available
                    url = response.data.next;
                } catch (error) {
                    console.error('Error fetching songs:', error)
                    res.status(500).send('Failed to fetch songs')
                }
            }
        }
        const filteredSongs = songs.map(song => ({
            name: song.track.name
        }))
        res.json({ songs: JSON.stringify(filteredSongs) })
    } else {
        res.status(404).send('Failed to find user with session token')
    }
})

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message })
})

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' })
})

async function refreshSpotifyAccessTokenIfNeeded(username) {
    const connection = await DB.getSpotifyConnection(username)
    if (connection) {
        const now = Date.now();
        if (connection.expirationDate && now > connection.expirationDate - 5 * 60 * 1000) { // Refresh 5 minutes before expiration
            console.log('Access token is about to expire, refreshing...');
            try {
                const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: connection.refreshToken,
                }), {
                    headers: {
                        'Authorization': `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                connection.accessToken = tokenResponse.data.access_token;
                connection.expirationDate = Date.now() + (tokenResponse.data.expires_in * 1000); // Update expiration time
                await DB.updateSpotifyConnection(username, connection.accessToken, connection.refreshToken, connection.expirationDate, connection.displayName)
                console.log('Access token refreshed');
            } catch (error) {
                console.error('Error refreshing access token:', error);
            }
        }
    }
}

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    })
}