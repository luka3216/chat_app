const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const randomString = require('./randomStrings')

const router = new Router()

router.post('/', async (req, res) => {
    dbCon.checkUserPassword(req.body.username, req.body.password, (data) => {
        if (data.result === true) {
            let sessionID = randomString.getRandomString()
            dbCon.registerSession(sessionID, data.user_id, (result) => {
                res.send({ sessionID: sessionID, userID: data.user_id })
                res.status(HttpStats.OK)
                res.end()
            })       
        } else {
            res.status(400)
            res.end()
        }
    })
})

module.exports = router