import {chatFriendManager} from './individualChatManager.js'

export class FriendsApp {
    constructor() {
        this.chatFriendManager = new chatFriendManager()
    }

    upadateList() {
        fetch('./api/users', {
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
                console.log(response.status)
                if (response.status === 200) {
                    response.json().then(response => {
                        this.users = response
                        console.log(this.users)
                        this._render()
                    })

                } else if (response.status === 400) {
                }
            })

    }

    _render() {
        let parent = document.querySelector('#friend-list')
        parent.innerHTML = "";
        var temp = document.getElementsByTagName("template")[3];

        this.users.forEach(element => {
            console.log(element)
            if (element._id != localStorage.getItem('userID')) {
                var clon = temp.content.cloneNode(true)
                clon.querySelector('.name').innerHTML = element.userData.name
                if (element.date) {
                    let date = new Date(element.date)
                    if (Date.now() - date < 86400000) {
                        clon.querySelector('.time').innerHTML = date.toISOString().substring(11, 16)
                    } else {
                        clon.querySelector('.time').innerHTML = date.toISOString().substring(5, 9)
                    } clon.querySelector('.msg-fragment').innerHTML = element.message
                }
                clon.querySelector('img').setAttribute('src', 'http://www.status77.in/wp-content/uploads/2015/07/14533584_1117069508383461_6955991993080086528_n.jpg')
                clon.querySelector('.chat-friend').setAttribute('id', element.userData.user_id)
                clon.querySelector('.chat-friend').addEventListener('click', this.manageClickOnFriend)
                parent.appendChild(clon);
            }
        })

    }

    manageClickOnFriend(event) {
        let friendName;
        let friendID;
        event.path.some((elem) => {
            if (elem.getAttribute('class') === 'chat-friend') {
                friendID = elem.getAttribute('id')
                friendName = elem.querySelector('.name').innerHTML
                return true
            }
        })
        new chatFriendManager().update(friendID, friendName)


    }

    addFriend() {
        let data = {
            friendID: document.querySelector('#new-friend').value
        }
        fetch('./api/users', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log(response.status)
                if (response.status === 200) {
                        this.upadateList();
                } else if (response.status === 400) {
                }
            })
    }
}