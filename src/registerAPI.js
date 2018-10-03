const Router = require('express').Router
const dbCon = require('./db')

const router = new Router()

router.post('/', async (req, res) => {
    dbCon.registerNewUser(req.body.email, req.body.phone, req.body.password, req.body.name)
    .then((data) => {
        res.status(data.code)
        res.end()
    })
})

module.exports = router