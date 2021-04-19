import { render_repos } from "./repos.js";

window.onload = init();

function init() {
    chrome.storage.sync.get(["TOKEN", "only_mine", "fullname"], function (setting) {
        var TOKEN = (setting["TOKEN"] == "undefined") ? undefined : setting["TOKEN"];
        var only_mine = (setting["only_mine"] == "undefined") ? undefined : setting["only_mine"];
        var fullname = (setting["fullname"] == "undefined") ? undefined : setting["fullname"];

        var btn = document.createElement("button");
        btn.innerText = "Setting";
        document.body.appendChild(btn);
        btn.addEventListener("click", function () { chrome.tabs.create({ "url": "options.html" }) });

        var msg = document.createElement("p");
        document.body.appendChild(msg);

        if (TOKEN) {
            msg.innerText = "loading...";

            var request = new XMLHttpRequest();
            request.open("GET", "https://api.github.com/user/repos?per_page=100&visibility=all&sort=updated");
            request.onreadystatechange = function () {
                var repos = JSON.parse(request.responseText);
                if (request.status == 200) {
                    msg.innerText = "";
                    var request_user = new XMLHttpRequest();
                    request_user.open("GET", "https://api.github.com/user")
                    request_user.onreadystatechange = function () {
                        var user = JSON.parse(request_user.responseText);
                        if (request_user.status == 200) {
                            render_repos(repos, only_mine, fullname, TOKEN, user["name"]);
                        }
                        else {
                            msg.innerText = "Error";
                        }
                    }
                    request_user.setRequestHeader("Authorization", "token " + TOKEN);
                    request_user.send();
                }
                else {
                    msg.innerText = "Error";
                }
            }
            request.setRequestHeader("Authorization", "token " + TOKEN);
            request.send();
        }
        else {
            msg.innerText = "No token provided.";
        }
    })
}
