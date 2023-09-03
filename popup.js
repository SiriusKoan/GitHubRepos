import { RepoManager } from "./repos.js";

var repo_renderer = new RepoManager([], "");

function clear_filter() {
    document.getElementById("only_mine").checked = false;
    document.getElementById("language").selectedIndex = 0;
    repo_renderer.renderRepos();
}

function set_dark_mode(dark_mode) {
    chrome.storage.sync.set({
        "dark_mode": dark_mode
    })
    if (dark_mode) {
        document.body.classList.add("dark_mode");
    }
    else {
        document.body.classList.remove("dark_mode");
    }
}

window.onload = init();

function init() {
    let setting_btn = document.getElementById("setting");
    setting_btn.addEventListener("click", function () { chrome.tabs.create({ "url": "options.html" }) });
    let clear_btn = document.getElementById("clear_filter");
    clear_btn.addEventListener("click", function () { clear_filter() })
    let dark_mode_btn = document.getElementById("dark_mode");
    dark_mode_btn.addEventListener("click", (event) => {
        console.log(event.target.checked);
        set_dark_mode(event.target.checked);
    })
    let filter_form = document.getElementById("filter-form");
    filter_form.addEventListener("submit", function (event) { event.preventDefault(); })
    filter_form.addEventListener("change", function () { repo_renderer.renderRepos(); })

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
                    repo_renderer.username = user["name"];
                }
            }
            request_user.setRequestHeader("Authorization", "token " + TOKEN);
            request_user.send();

            let request_repo = new XMLHttpRequest();
            request_repo.open("GET", "https://api.github.com/user/repos?per_page=1000&visibility=all&sort=updated");
            request_repo.onreadystatechange = function () {
                if (request_repo.readyState == XMLHttpRequest.DONE && request_repo.status == 200) {
                    let repos = JSON.parse(request_repo.responseText);
                    msg.innerText = "";
                    repo_renderer.repos = repos;
                    repo_renderer.renderRepos();
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
