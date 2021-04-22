import { render_repos } from "./repos.js";

window.onload = init();

function init() {
    chrome.storage.sync.get(["TOKEN", "only_mine", "fullname", "dark_mode"], function (setting) {
        var TOKEN = (setting["TOKEN"] == "undefined") ? undefined : setting["TOKEN"];
        var only_mine = (setting["only_mine"] == "undefined") ? false : setting["only_mine"];
        var fullname = (setting["fullname"] == "undefined") ? false : setting["fullname"];
        var dark_mode = (setting["dark_mode"] == "undefined") ? undefined : setting["dark_mode"];
        
        if (dark_mode) {
            document.body.classList.add("dark_mode");
        }

        var btn = document.createElement("button");
        btn.id = "setting";
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
                    render_repos(repos, only_mine, fullname, TOKEN, dark_mode);
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
