const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./src/loginAPI')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use('/api/login', userRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))