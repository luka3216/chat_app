var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
var sha256 = require('sha256')


let checkUserPassword =  (username, password, callback) => {
    passwordHash = sha256(password).toUpperCase()
    MongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db("test")
        dbo.collection("users").findOne(({email: username} || {phone: username}) && {passwordHash: passwordHash},  function(err, result) {
          if (err) throw err
          db.close()
          if (result != null) {
              callback(true)
          } else {
              callback(false)
          }
        })
      })
}

module.exports = { checkUserPassword };