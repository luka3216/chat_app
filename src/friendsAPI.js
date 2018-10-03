const Router = require('express').Router
const HttpStats = require('http-status-code')
const dbCon = require('./db')
const Cookies = require('cookies')

const router = new Router()

router.get('/', (req, res) => {
    let cookies = new Cookies(req, res)
    let sessionID = cookies.get('sessionID')
    let userID = cookies.get('userID')
    if (!sessionID || !userID) {
        res.status(400)
        res.end()
        return
    }
    dbCon.checkSession(sessionID)
        .then((result) => {
            if (result.code === 200) {
                dbCon.getConversations(userID)
                    .then((data) => {
                        if (data.code === 200) {
                            let resData = new Array()
                            data.data.forEach(element => {
                                let resTime = 0
                                let res = new Object();
                                element.messages.forEach((elem) => {
                                    if (elem.receiver === userID) {
                                        if (elem.date > resTime) {
                                            res.date = elem.date
                                            res.message = elem.message
                                        }
                                    }
                                })
                                element.members.forEach(elem => {
                                    if (elem !== userID) {
                                        dbCon.getUserData(elem)
                                            .then((resp) => {
                                                res.userData = resp
                                                resData.push(res)
                                            })
                                    }
                                })
                            });
                            res.status(200)
                            setTimeout(() => {
                                res.send(resData)
                                res.end()

                            }, 2000);
                        } else {
                            res.status(data.code)
                            res.end()
                        }
                    })
            } else {
                res.status(result.code)
                res.end()
            }
        })
})

router.post('/', (req, res) => {
    let cookies = new Cookies(req, res)
    let sessionID = cookies.get('sessionID')

    dbCon.checkSession(sessionID)
        .then((result) => {
            if (result.code === 200) {
                dbCon.findUser(req.body.friendID)
                    .then((resul) => {
                        if (resul.code === 200) {
                            if (resul.user_id) {
                                dbCon.initConversation(result.userID, resul.user_id)
                                    .then(resu => {
                                        res.status(result.code)
                                        res.end()
                                    })
                            }
                        }
                    })
            } else {
            }
        })
})

module.exports = router