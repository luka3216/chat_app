const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const randomString = require('./randomStrings')

const router = new Router()

router.post('/', async (req, res) => {
    dbCon.registerNewUser(req.body.email, req.body.phone, req.body.password, (data) => {
        if (data.result === true) {
            res.status(HttpStats.OK)
         //   dbCon.initiateUserFriendsEntry(data.userID)
        } else {
            res.status(400)
            res.end()
        }
    })
})

module.exports = router