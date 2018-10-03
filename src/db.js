var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
var sha256 = require('sha256')
const randomString = require('./randomStrings')


let checkUserPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        passwordHash = sha256(password).toUpperCase()
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("users").findOne({ $and: [{ passwordHash: passwordHash }, { $or: [{ email: username }, { phone: username }] }] }, function (err, result) {
                if (err) {
                    resolve({ code: 500 })
                    return
                } else {
                    db.close()
                    if (result != null) {
                        resolve({ code: 200, user_id: result._id })
                    } else {
                        resolve({ code: 400 })
                    }
                }
            })
        })
    })
}


let registerNewUser = (email, phone, password) => {
    return new Promise((resolve, reject) => {
        let passwordHash = sha256(password).toUpperCase()
        let id = randomString.getRandomString();
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("users").insertOne({ _id: id, email: email, phone: phone, passwordHash: passwordHash, date: Date.now() }, function (err, result) {
                if (err) {
                    resolve({ code: 409 })
                    return
                }
                db.close()
                if (result != null) {
                    resolve({ userID: id, code: 201 })
                } else {
                    resolve({ code: 400 })
                }
            })
        })
    })
}

let getConversations = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("users").find({}, { projection: { _id: 1, email: 1, phone: 1 } }).toArray(function (err, res) {
                if (err) {
                    resolve({ code: 500 })
                    return
                }
                db.close()
                if (res != null) {
                    resolve({ code: 200, data: res })
                } else {
                    resolve({ code: 400 })
                }
            })
        })
    })
}

let getChatData = (asker, other) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            console.log(1)
            dbo.collection("chat_messages").find({ $or: [{ sender: asker, receiver: other }, { sender: other, receiver: asker }] }
                , { projection: { sender: 1, receiver: 1, date: 1 } }).toArray(function (err, res) {
                    if (err) {
                        resolve({ code: 500 })
                        return
                    }
                    console.log(2)
                    db.close()
                    console.log(res)
                    resolve({ code: 200, data: res })
                })
        })
    })
}

let addChatMessage = (senderr, receiverr, msg) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return
        }
        var dbo = db.db("test")
        dbo.collection("chat_messages").insertOne({ sender: senderr, receiver: receiverr, message: msg, date: Date.now() }, function (err, res) {
            if (err) {
                return
            }
            db.close()
        })
    })
}

let checkSession = (sessionID) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("sessions").findOne({ _id: sessionID }, function (err, res) {
                if (err) {
                    resolve({ code: 500 })
                    return
                }
                db.close()
                if (res != null) {
                    resolve({ code: 200, userID: res.user_id })
                } else {
                    resolve({ code: 404 })
                }
            })
        })
    })
}

let registerSession = (sessionID, userID) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("sessions").insertOne({ _id: sessionID, user_id: userID }, function (err, result) {
                if (err) {
                    resolve({ code: 500 })
                    return;
                }
                db.close()
                if (result != null) {
                    resolve({ code: 201 })
                } else {
                    resolve({ code: 400 })
                }
            })
        })
    })
}

module.exports = { checkUserPassword, registerNewUser, registerSession, checkSession, getConversations, getChatData, addChatMessage };