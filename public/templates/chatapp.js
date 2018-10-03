import {FriendsApp} from './friendsapp.js'

export class chatApplication {
    constructor() {
        this._render();
        this.FriendsApp = new FriendsApp(this.domObj.querySelector('#friend-list'));
        this.FriendsApp.upadateList()
        console.log(document.getElementById('friend-submit'))

    }

    _render() {
        let root = document.querySelector('#app-root')
        root.innerHTML = ""
        var temp = document.getElementsByTagName("template")[2];
        var clon = temp.content.cloneNode(true);
        root.appendChild(clon);
        
        this.domObj = root.children[0]
        document.getElementById('friend-submit').addEventListener('click', () => {
            console.log('cloc')
            this.FriendsApp.addFriend();
        })
    }

    receiveMessage(message) {

    }
}