import { render_repos } from "./repos.js";

function init() {
    chrome.storage.sync.get(["TOKEN"], function (data) {
        var TOKEN = data["TOKEN"]

        var btn = document.createElement("button");
        btn.innerText = "Setting";
        document.body.appendChild(btn);
        btn.addEventListener("click", function () { chrome.tabs.create({ "url": "options.html" }) });

        if (TOKEN) {
            var msg = document.createElement("p");
            msg.innerText = "loading...";
            document.body.appendChild(msg);

            var request = new XMLHttpRequest();
            request.open("GET", "https://api.github.com/user/repos?per_page=100&visibility=all&sort=updated");
            request.onreadystatechange = function () {
                var repos = JSON.parse(request.responseText);
                console.log(request.responseText);
                if (request.status == 200) {
                    msg.innerText = "";
                    render_repos(repos);
                }
                else {
                    msg.innerText = "Error";
                }
            }
            request.setRequestHeader("Authorization", "token " + TOKEN);
            request.send();
        }
    })
}

window.onload = init();
