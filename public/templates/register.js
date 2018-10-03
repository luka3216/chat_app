import {loginForm} from './login.js'

export class registerForm {
    constructor(parent) {
        this.parent = parent
    }

    _render() {
        let form = this.parent
        form.innerHTML = ""
        var temp = document.getElementsByTagName("template")[0];
        var clon = temp.content.cloneNode(true);
        form.appendChild(clon);
        form.style.height = '400px'
        document.getElementById('register-submit').addEventListener('click', () => {
            const formData = new FormData(document.getElementById('register-form'))
            let data = {
                phone: formData.get('phone'),
                email: formData.get('email'),
                name: formData.get('name'),
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
                    if (response.status === 201) {
                        new loginForm(this.parent)._render()
                    } else if (response.status === 400) {
                    }
                })

        })
    }
}
