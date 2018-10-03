import {registerForm} from './register.js'
import {chatApplication} from './chatapp.js'

export class loginForm {
    constructor(parent) {
        this.parent = parent
    }

    _render() {
        let form = this.parent
        form.innerHTML = ""
        var temp = document.getElementsByTagName("template")[1];
        var clon = temp.content.cloneNode(true);
        form.appendChild(clon);
        form.style.height = '350px'

        document.getElementById('login-submit').addEventListener('click', () => {
            const formData = new FormData(document.querySelector('#login-form'))
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
                    if (response.status === 200) {
                        response.json().then(response => {
                            document.cookie = "sessionID=" + response.sessionID
                            document.cookie = "userID=" + response.userID
                            localStorage.setItem("sessionID", response.sessionID)
                            localStorage.setItem('userID', response.userID)
                        })
                        new chatApplication()._render();

                    } else if (response.status === 400) {
                    }
                })
        })
        document.getElementById('register-switch').addEventListener('click', () => {
            new registerForm(document.querySelector('#form-div'))._render()
        })
    }
}