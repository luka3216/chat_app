export class chatApplication {
    constructor() {

    }

    _render() {
        let root = document.querySelector('#app-root')
        root.innerHTML = ""
        var temp = document.getElementsByTagName("template")[2];
        var clon = temp.content.cloneNode(true);
        root.appendChild(clon);
    }
}