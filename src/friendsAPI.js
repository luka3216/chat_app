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

module.exports = router