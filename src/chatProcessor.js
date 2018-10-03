const dbCon = require('./db')

let live_sockets = new Object();

let registerChatClient = (userID, WebSocket) => {
  live_sockets[userID] = WebSocket
}

let removeChatClient = (userID) => {
  live_sockets[userID] = null
}

let processClient = (client) => {
  console.log('connected')

  client.on('message', (message) => {
    message = JSON.parse(message)
    if (message.type === 'i') {
      dbCon.checkSession(message.sessionID)
      .then((result) => {
        if (result.code === 200) {
          registerChatClient(result.userID, client)
          client.chatUserID = result.userID
        } else {

        }
      })
    }
    else if (message.type === 'msg') {
      let receiver = live_sockets[message.receiver]
      if (receiver) {
        receiver.send(message.data)
      }
      
      if (client.chatUserID && message.data && message.receiver)
        dbCon.addChatMessage(client.chatUserID, message.receiver, message.data)
    }
  })
}


module.exports = { processClient }