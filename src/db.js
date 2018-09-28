var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
var sha256 = require('sha256')
const randomString = require('./randomStrings')


let checkUserPassword = (username, password, callback) => {
    passwordHash = sha256(password).toUpperCase()
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        var dbo = db.db("test")
        dbo.collection("users").findOne(({ email: username } || { phone: username }) && { passwordHash: passwordHash }, function (err, result) {
            if (err) throw err
            db.close()
            if (result != null) {
                callback({result: true, user_id: result._id})
            } else {
                callback({result:false})
            }
        })
    })
}


let registerNewUser = (email, phone, password, callback) => {
    let passwordHash = sha256(password).toUpperCase()
    let id = randomString.getRandomString();
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        var dbo = db.db("test")
        dbo.collection("users").insertOne({_id: id, email: email, phone: phone,  passwordHash: passwordHash}, function (err, result) {
            if (err) callback({result: false})
            db.close()
            if (result != null) {
                callback({userID: id, result: true})
            } else {
                callback({result: false})
            }
        })
    })
}

let initiateUserFriendsEntry = (userID) => {
    let id = randomString.getRandomString();
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        var dbo = db.db("test")
        dbo.collection("user_friends").insertOne({_id: id, user_id: userID, friends: []}, function (err, result) {
            db.close()
        })
    })
}

let checkSession = (sessionID, callback) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        var dbo = db.db("test")
        dbo.collection("sessions").findOne({_id: sessionID}, function (err, res) {
            if (err) callback(false)
            db.close()
            if (res != null) {
                callback({result: true, userID: result.user_id})
            } else {
                callback(false)
            }
        })
    })
}

let registerSession = (sessionID, userID, callback) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        var dbo = db.db("test")
        dbo.collection("sessions").insertOne({_id: sessionID, user_id: userID}, function (err, result) {
            if (err) callback(false)
            db.close()
            if (result != null) {
                callback(true)
            } else {
                callback(false)
            }
        })
    })
}

module.exports = { checkUserPassword, registerNewUser, registerSession, initiateUserFriendsEntry, checkSession, addConversation};