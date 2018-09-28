const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')

const router = new Router()

router.get('/',  async (req, res) => {
    const client = dbCon.checkActiveSession(req.body.sessionID)
    if (client != null) {
        const activeConverastions = dbCon.getConversations(client.client_id);
    } else {
        res.status(400)
    }
    res.end();
})
router.post('/', async (req, res) => {
    dbCon.checkSession(req.body.sessionID, (result) => {
        if (result === true) {
            dbCon.getConversations((data) => {
                if (data.result === true) {
                    res.send(data.data);
                    res.status(HttpStats.OK)
                    res.end()
                } else {
                    res.end()
                }
            })
        } else {
            res.status(400)
            res.end()
        }
        res.end()
    })
})
module.exports = router