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

let getUserData = (userID) => {
    return new Promise((resolve, reject) => {
                MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("users").findOne({_id: userID}, 
                { projection: { _id: 1, name: 1} },
                function (err, result) {
                if (err) {
                    resolve({ code: 500 })
                    return
                } else {
                    db.close()
                    if (result != null) {
                        resolve({ code: 200, user_id: result._id, name: result.name })
                    } else {
                        resolve({ code: 400 })
                    }
                }
            })
        })
    })
}


let findUser = (username) => {
    return new Promise((resolve, reject) => {
                MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("users").findOne({$or: [{email: username}, {phone: username}, {name: username}]}, 
                { projection: { _id: 1} },
                function (err, result) {
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




let registerNewUser = (email, phone, password, name) => {
    return new Promise((resolve, reject) => {
        let passwordHash = sha256(password).toUpperCase()
        let id = randomString.getRandomString();
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("users").insertOne({ _id: id, email: email, phone: phone, passwordHash: passwordHash, name: name, date: Date.now() }, function (err, result) {
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

let initConversation = (userID, userID2)=> {
    return new Promise((resolve, reject) => {
        let id = randomString.getRandomString();
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("conversations").insertOne({ _id: id, members: [userID,  userID2], messages: [], date: Date.now() }, function (err, result) {
                if (err) {
                    resolve({ code: 409 })
                    return
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

let getConversations = (userID) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                resolve({ code: 500 })
                return
            }
            var dbo = db.db("test")
            dbo.collection("conversations").find({members: userID}, { projection: { _id: 0, members: 1, messages:1} }).toArray(function (err, res) {
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
            dbo.collection("conversations").find({ members: {$all: [asker, other]}}
                , { projection: {messages: 1, _id: 0} }).toArray(function (err, res) {
                    if (err) {
                        resolve({ code: 500 })
                        return
                    }
                    db.close()
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
        dbo.collection("conversations").updateOne({members: {$all: [senderr, receiverr]}}
            , {$push: {messages: {sender: senderr, receiver: receiverr, message: msg, date: Date.now()}}}, function (err, res) {
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

module.exports = { checkUserPassword, registerNewUser, registerSession, checkSession, getConversations, getChatData, addChatMessage, initConversation, getUserData, findUser };