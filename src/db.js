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
        dbo.collection("users").findOne(({ email: username } || { phone: username }) && { passwordHash: passwordHash }, function (err, result) {
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
        dbo.collection("users").insertOne({ _id: id, email: email, phone: phone, passwordHash: passwordHash }, function (err, result) {
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

module.exports = { checkUserPassword, registerNewUser, registerSession, checkSession, getConversations };