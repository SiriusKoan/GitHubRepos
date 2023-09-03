import { render_repos } from "./repos.js";

var repos;
var username;

function repo_filter(repos, only_mine, language) {
    if (only_mine) {
        repos = repos.filter(repo => repo["owner"]["login"] == username);
    }
    if (language) {
        repos = repos.filter(repo => repo["language"] == language)
    }
    return repos;
}

function get_filter() {
    let language_field = document.getElementById("language")
    let only_mine_field = document.getElementById("only_mine")
    let fullname_field = document.getElementById("fullname")
    window.location.reload();
}

function clear_filter() {
}

function set_dark_mode(dark_mode) {
    chrome.storage.sync.set({
        "dark_mode": dark_mode
    })
    window.location.reload();
}

window.onload = init();

function init() {
    let setting_btn = document.getElementById("setting");
    setting_btn.addEventListener("click", function () { chrome.tabs.create({ "url": "options.html" }) });
    let clear_btn = document.getElementById("clear_filter");
    clear_btn.addEventListener("click", function () { clear_filter() })
    let dark_mode_btn = document.getElementById("dark_mode");
    dark_mode_btn.addEventListener("click", (event) => {
        if (event.currentTarget.checked) {
            set_dark_mode(true);
        }
        else {
            set_dark_mode(false);
        }
    })
    chrome.storage.sync.get(["TOKEN", "dark_mode"], function (setting) {
        // load setting
        let TOKEN = setting["TOKEN"];
        let dark_mode = setting["dark_mode"]

        // render setting
        document.getElementById("dark_mode").checked = dark_mode;

        if (dark_mode) {
            document.body.classList.add("dark_mode");
        }
        let msg = document.createElement("p");
        document.body.appendChild(msg);

        if (TOKEN) {
            msg.innerText = "loading...";
            let request_user = new XMLHttpRequest();
            request_user.open("GET", "https://api.github.com/user");
            request_user.onreadystatechange = function () {
                if (request_user.readyState == XMLHttpRequest.DONE && request_user.status == 200) {
                    let user = JSON.parse(request_user.responseText);
                    username = user["name"];
                }
            }
            request_user.setRequestHeader("Authorization", "token " + TOKEN);
            request_user.send();

            let request_repo = new XMLHttpRequest();
            request_repo.open("GET", "https://api.github.com/user/repos?per_page=1000&visibility=all&sort=updated");
            request_repo.onreadystatechange = function () {
                if (request_repo.readyState == XMLHttpRequest.DONE && request_repo.status == 200) {
                    console.log(request_repo.responseText);
                    repos = JSON.parse(request_repo.responseText);
                    msg.innerText = "";
                    render_repos(repo_filter(repos, only_mine, language), fullname, dark_mode);
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
