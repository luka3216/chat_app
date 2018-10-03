const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const randomString = require('./randomStrings')

const router = new Router()

router.post('/', async (req, res) => {
    dbCon.checkUserPassword(req.body.username, req.body.password)
    .then((data) => {
        if (data.code === 200) {
            let sessionID = randomString.getRandomString()
            dbCon.registerSession(sessionID, data.user_id)
            .then(() => {
                res.send({ sessionID: sessionID, userID: data.user_id })
                res.status(HttpStats.OK)
                res.end()
            })       
        } else {
            res.status(data.code)
            res.end()
        }
    })
})

module.exports = router