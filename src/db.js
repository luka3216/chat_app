var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
var sha256 = require('sha256')
const randomString = require('./randomStrings')


let checkUserPassword = (username, password, callback) => {
    passwordHash = sha256(password).toUpperCase()
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback({ code: 500 })
            return
        }
        var dbo = db.db("test")
        dbo.collection("users").findOne({ $and: [{passwordHash: passwordHash},{$or: [{ email: username}, { phone: username}]}]}, function (err, result) {
            if (err) {
                callback({ code: 500 })
                return
            } else {
                db.close()
                if (result != null) {
                    callback({ code: 200, user_id: result._id })
                } else {
                    callback({ code: 400 })
                }
            }
        })
    })
}


let registerNewUser = (email, phone, password, callback) => {
    let passwordHash = sha256(password).toUpperCase()
    let id = randomString.getRandomString();
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback({ code: 500 })
            return
        }
        var dbo = db.db("test")
        dbo.collection("users").insertOne({ _id: id, email: email, phone: phone, passwordHash: passwordHash, date: Date.now() }, function (err, result) {
            if (err) {
                callback({ code: 409 })
                return
            }
            db.close()
            if (result != null) {
                callback({ userID: id, code: 201 })
            } else {
                callback({ code: 400 })
            }
        })
    })
}

let getConversations = (callback) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback({ code: 500 })
            return
        }
        var dbo = db.db("test")
        dbo.collection("users").find({}, { projection: { _id: 1, email: 1, phone: 1 } }).toArray(function (err, res) {
            if (err) {
                callback({ code: 500 })
                return
            }
            db.close()
            if (res != null) {
                callback({ code: 200, data: res })
            } else {
                callback({ code: 400 })
            }
        })
    })
}

let getChatData = (asker, other, callback) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback({ code: 500 })
            return
        }
        var dbo = db.db("test")
        dbo.collection("chat_messages").find({$or: [{sender: asker, receiver: other}, {sender:other, receiver:asker}]},function (err, res) {
            if (err) {
                callback({ code: 500 })
                return
            }
            db.close()
            if (res != null) {
                callback({ code: 200, data: res })
            } else {
                callback({ code: 400 })
            }
        })
    })
}

let addChatMessage = (senderr, receiverr, msg) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return
        }
        var dbo = db.db("test")
        dbo.collection("chat_messages").insertOne({sender: senderr, receiver: receiverr, message: msg, date: Date.now()}, function (err, res) {
            if (err) {
                return
            }
            db.close()
        })
    })
}

let checkSession = (sessionID, callback) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback({ code: 500 })
            return
        }
        var dbo = db.db("test")
        dbo.collection("sessions").findOne({ _id: sessionID }, function (err, res) {
            if (err) {
                callback({ code: 500 })
                return
            }
            db.close()
            if (res != null) {
                callback({ code: 200, userID: res.user_id })
            } else {
                callback({ code: 404 })
            }
        })
    })
}

let registerSession = (sessionID, userID, callback) => {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback({ code: 500 })
            return
        }
        var dbo = db.db("test")
        dbo.collection("sessions").insertOne({ _id: sessionID, user_id: userID }, function (err, result) {
            if (err) {
                callback({ code: 500 })
                return;
            }
            db.close()
            if (result != null) {
                callback({ code: 201 })
            } else {
                callback({ code: 400 })
            }
        })
    })
}

module.exports = { checkUserPassword, registerNewUser, registerSession, checkSession, getConversations, getChatData, addChatMessage };