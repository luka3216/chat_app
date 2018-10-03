import {FriendsApp} from './friendsapp.js'

export class chatApplication {
    constructor() {
        this._render();
        this.FriendsApp = new FriendsApp(this.domObj.querySelector('#friend-list'));
        this.FriendsApp.upadateList()
    }

    _render() {
        let root = document.querySelector('#app-root')
        root.innerHTML = ""
        var temp = document.getElementsByTagName("template")[2];
        var clon = temp.content.cloneNode(true);
        root.appendChild(clon);
        
        this.domObj = root.children[0]
    }
}