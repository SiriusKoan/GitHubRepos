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
            "save_time": Date.now(),
            "language": language_field.options[language_field.selectedIndex].value,
            "only_mine": document.getElementById("only_mine").checked,
            "fullname": document.getElementById("fullname").checked
        }
    );
    window.location.reload();
}

function clear_filter() {
    chrome.storage.sync.remove("save_time");
    chrome.storage.sync.remove("language");
    chrome.storage.sync.remove("only_mine");
    chrome.storage.sync.remove("fullname");
    window.location.reload();
}

function set_dark_mode(dark_mode) {
    chrome.storage.sync.set({
        "dark_mode": dark_mode
    })
    window.location.reload();
}

window.onload = init();

function init() {
    // clear filter 30 seconds later
    chrome.storage.sync.get(["save_time"], function (info) {
        var save_time = info["save_time"];
        if (Date.now() - save_time > 30000) {
            clear_filter();
        }
    })
    var setting_btn = document.getElementById("setting");
    setting_btn.addEventListener("click", function () { chrome.tabs.create({ "url": "options.html" }) });
    var clear_btn = document.getElementById("clear_filter");
    clear_btn.addEventListener("click", function () { clear_filter() })
    var dark_mode_btn = document.getElementById("dark_mode");
    dark_mode_btn.addEventListener("click", (event) => {
        if (event.currentTarget.checked) {
            set_dark_mode(true);
        }
        else {
            set_dark_mode(false);
        }
    })
    document.getElementById("submit-filter").addEventListener("click", function () { get_filter() })
    chrome.storage.sync.get(["TOKEN", "only_mine", "language", "fullname", "dark_mode"], function (setting) {
        // load setting
        var TOKEN = setting["TOKEN"];
        var only_mine = setting["only_mine"]
        var language = (setting["language"] == undefined) ? "" : setting["language"];
        var fullname = setting["fullname"]
        var dark_mode = setting["dark_mode"]

        // render setting
        document.getElementById("language").options[0].text = language;
        document.getElementById("only_mine").checked = only_mine;
        document.getElementById("fullname").checked = fullname;
        document.getElementById("dark_mode").checked = dark_mode;

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
