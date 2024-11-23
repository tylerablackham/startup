import { MongoClient } from 'mongodb'
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import dotenv from 'dotenv'

dotenv.config()
const config = {
  userName: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  hostname: process.env.DB_HOSTNAME
}

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const db = client.db('startup')
const userCollection = db.collection('user');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect()
  await db.command({ ping: 1 })
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`)
  process.exit(1)
});

export function getUser(username) {
  return userCollection.findOne({ username: username })
}

export function getUserByToken(token) {
  return userCollection.findOne({ token: token })
}

export async function getNumUsers() {
  return (await userCollection.find({}).toArray()).length
}

export async function createUser(username, email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10)

  const user = {
    username: username,
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  }
  await userCollection.insertOne(user)
  return user
}
