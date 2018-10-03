const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const Cookies = require('cookies')

const router = new Router()

router.get('/:userID', (req, res) => {
  let cookies = new Cookies(req, res)
  let sessionID = cookies.get('sessionID')
  if (!sessionID) {
    res.status(400)
    res.end()
    return
  }
  dbCon.checkSession(sessionID)
    .then((result) => {
      if (result.code === 200) {
        dbCon.getChatData(result.userID, req.params.userID)
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

router.post('/', async (req, res) => {

  let cookies = new Cookies(req, res)
  let userID = cookies.get('userID')
  let userID2 = req.body.userID2
  dbCon.initConversation(userID, userID2)
    .then(() => {
      res.status(200)
      res.end()
    })
})

module.exports = router