db.users.createIndex( { "_id": 1 }, { unique: true } )
db.users.createIndex( { "email": 1 }, { unique: true } )
db.users.createIndex( { "phone": 1 }, { unique: true } )