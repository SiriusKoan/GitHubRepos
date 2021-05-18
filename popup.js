import { render_repos } from "./repos.js";

function repo_filter(repos, only_mine, username, language) {
    if (only_mine) {
        repos = repos.filter(repo => repo["owner"]["login"] == username);
    }
    if (language) {
        repos = repos.filter(repo => repo["language"] == language)
    }
    return repos;
}

function get_filter() {
    var language_field = document.getElementById("language")
    chrome.storage.sync.set(
        {
            "language": language_field.options[language_field.selectedIndex].value,
            "only_mine": document.getElementById("only_mine").checked,
            "fullname": document.getElementById("fullname").checked
        }
    );
    window.location.reload();
}

window.onload = init();

function init() {
    var btn = document.getElementById("setting");
    btn.addEventListener("click", function () { chrome.tabs.create({ "url": "options.html" }) });
    document.getElementById("submit-filter").addEventListener("click", function () { get_filter() })
    chrome.storage.sync.get(["TOKEN", "only_mine", "language", "fullname", "dark_mode"], function (setting) {
        // load setting
        var TOKEN = (setting["TOKEN"] == "undefined") ? undefined : setting["TOKEN"];
        var only_mine = (setting["only_mine"] == "undefined") ? false : setting["only_mine"];
        var language = (setting["language"] == "undefined") ? "" : setting["language"];
        var fullname = (setting["fullname"] == "undefined") ? false : setting["fullname"];
        var dark_mode = (setting["dark_mode"] == "undefined") ? undefined : setting["dark_mode"];

        // render setting
        document.getElementById("language").options[0].text = language;
        document.getElementById("only_mine").checked = only_mine;
        document.getElementById("fullname").checked = fullname;

        if (dark_mode) {
            document.body.classList.add("dark_mode");
        }
        var msg = document.createElement("p");
        document.body.appendChild(msg);

        if (TOKEN) {
            msg.innerText = "loading...";
            var username = "";
            var request_user = new XMLHttpRequest();
            request_user.open("GET", "https://api.github.com/user");
            request_user.onreadystatechange = function () {
                var user = JSON.parse(request_user.responseText);
                username = user["name"];
            }
            request_user.setRequestHeader("Authorization", "token " + TOKEN);
            request_user.send();

            var request_repo = new XMLHttpRequest();
            request_repo.open("GET", "https://api.github.com/user/repos?per_page=100&visibility=all&sort=updated");
            request_repo.onreadystatechange = function () {
                var repos = JSON.parse(request_repo.responseText);
                if (request_repo.status == 200) {
                    msg.innerText = "";
                    render_repos(repo_filter(repos, only_mine, username, language), fullname, dark_mode);
                }
                else {
                    msg.innerText = "Error";
                }
            }
            request_repo.setRequestHeader("Authorization", "token " + TOKEN);
            request_repo.send();
        }
        else {
            msg.innerText = "No token provided.";
        }
    })
}
