const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')

const router = new Router()

router.post('/', async (req, res) => {
    dbCon.checkSession(req.body.sessionID, (data) => {
        if (data.result === true) {
            res.status(HttpStats.OK)
        } else {
            res.status(400)
            res.end()
        }
        res.end()
    })
})

module.exports = router