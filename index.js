const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const loginRouter = require('./src/loginAPI')
const registerRouter = require('./src/registerAPI')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))