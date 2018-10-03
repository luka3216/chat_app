const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const Cookies = require('cookies')

const router = new Router()

router.get('/', (req, res) => {
    let cookies = new Cookies(req, res)
    let sessionID = cookies.get('sessionID')
    if (!sessionID) {
        req.status(400)
        res.end()
        return
    }
    dbCon.checkSession(sessionID)
    .then((result) => {
        if (result.code === 200) {
            dbCon.getConversations()
            .then((data) => {
                if (data.code === 200) {
                    res.send(data.data);
                    res.status(HttpStats.OK)
                } else {
                    res.status(data.code)
                }
                res.end()
            })
        } else {
            res.status(result.code)
            res.end()
        }
    })
})
module.exports = router