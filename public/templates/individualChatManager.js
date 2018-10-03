export class chatFriendManager {
  constructor() {
    let WS = new WebSocket('ws://localhost:3000')
    WS.addEventListener('open', () => {
      var init = {
        type: 'i',
        sessionID: localStorage.getItem('sessionID')
      }
      WS.send(JSON.stringify(init))
    })

    WS.addEventListener('message', (event) => {
      console.log(event.data)
    })
    this.ws = WS
    document.querySelector('#chat-submit').addEventListener('click', (event) => {
      this.sendMessage()
    })
  }

  update(userID) {
    this.userID = userID
    fetch('./api/chat/' + userID, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
    })
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          response.json().then(response => {
            this._render(response[0].messages)
          })

        } else if (response.status === 400) {
        }
      })
  }

  _render(messages) {
    console.log(messages)
    let root = document.querySelector('#messages')
    root.innerHTML = ""
    var temp = document.getElementsByTagName("template")[4];
    messages.forEach(element => {
      var clon = temp.content.cloneNode(true);
      var date = new Date(element.date)
      if (element.receiver !== localStorage.userID) {
        clon.querySelector('.chat-msg').setAttribute('class', 'chat-msg self')
      }
      if (Date.now() - date < 86400000) {
        clon.querySelector('.time').innerHTML = date.toISOString().substring(11, 16)
      } else {
        clon.querySelector('.time').innerHTML = date.toISOString().substring(5, 9)
      } clon.querySelector('.msg-content span').innerHTML = element.message
      root.appendChild(clon);
    });
    root.scrollTop = root.scrollHeight;
  }

  sendMessage() {
    let msgText = document.querySelector('#chat-area').value
    let message = {
      data : msgText,
      receiver: this.userID,
      type: 'msg'
    }
    console.log(message)
    this.ws.send(JSON.stringify(message))
    setTimeout(() => {
      this.update(this.userID)
    }, 1000)
  }
}