export class FriendsApp {
    constructor() {
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
            var clon = temp.content.cloneNode(true)
            clon.querySelector('.name').innerHTML = element.name
            clon.querySelector('.time').innerHTML = element.email
            clon.querySelector('img').setAttribute('src', 'http://www.status77.in/wp-content/uploads/2015/07/14533584_1117069508383461_6955991993080086528_n.jpg')
            console.log(clon)
            parent.appendChild(clon);
        })
    }
}