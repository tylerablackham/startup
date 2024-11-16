import express from 'express'
import * as uuid from "uuid";

const app = express()

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

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})