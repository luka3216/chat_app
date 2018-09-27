export class FriendsManager {
    initiateFriendsUI(parent) {
        parent.innerHTML = '';
        let friendDOMObj = document.createElement('div')
        friendDOMObj.setAttribute('id', 'friends')
        parent.appendChild(friendDOMObj);
    }
} 