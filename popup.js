function init() {
    chrome.storage.sync.get(["TOKEN"], function(data){
        var TOKEN = data["TOKEN"]

        var btn = document.createElement("button");
        btn.innerText = "setting";
        document.body.appendChild(btn);
        btn.addEventListener("click", function() {chrome.tabs.create({"url": "options.html"})});

        if (TOKEN) {
            var msg = document.createElement("p");
            msg.innerText = "loading...";
            document.body.appendChild(msg);

            var request = new XMLHttpRequest();
            request.open("GET", "https://api.github.com/user/repos?per_page=100&visibility=all&sort=updated");
            request.onreadystatechange = function() {
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
            request.setRequestHeader("Authorization", "token "+TOKEN);
            request.send();
        }
    })
}

window.onload = init();

function create_repo_link(repo) {
    var container = document.createElement("p");
    var link = document.createElement("a");
    link.setAttribute("href", repo["html_url"]);
    link.innerText = repo["name"];
    container.appendChild(link);
}

function render_repos(repos) {
    for (let i = 0; i < repos.length; i++){
        repo = repos[i];
        var container = document.createElement("p");

        var avatar = document.createElement("img");
        avatar.setAttribute("src", repo["owner"]["avatar_url"]);
        container.appendChild(avatar);

        var link = document.createElement("a");
        link.setAttribute("href", repo["html_url"]);
        link.setAttribute("target", "_blank")
        link.innerText = repo["name"];
        container.appendChild(link);

        document.body.appendChild(container);
    }
}
