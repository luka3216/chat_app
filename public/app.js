import { FriendsManager } from './peopleApp.js'

document.getElementById('login-submit').addEventListener('click', () => {
    const formData = new FormData(document.getElementById('login-form'))
    let data = {
        username: formData.get('username'),
        password: formData.get('password')
    }
    fetch('./api/login', {
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
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(response => {
            console.log(response.status)
            if (response.status === 200) {
                response.json().then(response => {
                    document.cookie = "sessionID=" + response.sessionID
                    document.cookie = "userID=" + response.userID
                    localStorage.setItem("sessionID", response.sessionID)
                    localStorage.setItem('userID', response.userID)
                })
                new FriendsManager().initiateFriendsUI(document.getElementById('app-root'));

            } else if (response.status === 400) {
            }
        })

})
/*
document.getElementById('register-submit').addEventListener('click', () => {
    const formData = new FormData(document.getElementById('register-form'))
    let data = {
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: formData.get('password')
    }
    fetch('./api/register', {
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
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(response => {
            console.log(response.status)
            if (response.status === 201) {
                console.log("registered")
            } else if (response.status === 400) {
            }
        })

})*/