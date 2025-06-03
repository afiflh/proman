require('dotenv').config()

const data = {}

module.exports = { ...process.env, ...data }