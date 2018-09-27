const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const randomString = require('./randomStrings')

const router = new Router()

router.post('/', async (req, res) => {
    dbCon.checkUserPassword(req.body.username, req.body.password, (result) => {
        if (result === true) {
            let sessionID = randomString.getRandomString()
            res.send({ sessionID: sessionID })
            res.status(HttpStats.OK)
        } else {
            res.status(400)
        }
        res.end();
    })
})

module.exports = router