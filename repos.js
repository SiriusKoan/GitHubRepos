function make_repo_avatar(owner) {
    var avatar = document.createElement("a");
    avatar.setAttribute("href", owner["html_url"]);
    avatar.setAttribute("target", "_blank")
    var avatar_img = document.createElement("img");
    avatar_img.setAttribute("src", owner["avatar_url"]);
    avatar.appendChild(avatar_img);
    return avatar;
}

function make_repo_link(repo, fullname) {
    var link = document.createElement("a");
    link.setAttribute("href", repo["html_url"]);
    link.setAttribute("target", "_blank")
    link.innerText = fullname ? repo["full_name"] : repo["name"]
    return link;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function render_repos(repos, only_mine, fullname, TOKEN, username_) {
    if (only_mine) {
        var request = new XMLHttpRequest();
        request.open("GET", "https://api.github.com/user");
        request.onreadystatechange = function () {
            var user = JSON.parse(request.responseText);
            var username = (request.status == 200) ? user["name"] : null;

            for (let i = 0; i < repos.length; i++) {
                var repo = repos[i];
                if (username == repo["owner"]["login"]) {
                    var container = document.createElement("p");
                    container.appendChild(make_repo_avatar(repo["owner"]));
                    container.appendChild(make_repo_link(repo, fullname));
                    if (repo["fork"]) {
                        var fork = document.createElement("img");
                        fork.setAttribute("src", "./imgs/fork-white.png");
                        container.appendChild(fork);
                    }
                    document.body.appendChild(container);
                }
            }

        }
        request.setRequestHeader("Authorization", "token " + TOKEN);
        request.send();
    }
    else {
        for (let i = 0; i < repos.length; i++) {
            var repo = repos[i];
            var container = document.createElement("p");
            container.appendChild(make_repo_avatar(repo["owner"]));
            container.appendChild(make_repo_link(repo, fullname));
            if (repo["fork"]) {
                var fork = document.createElement("img");
                fork.setAttribute("src", "./imgs/fork-white.png");
                container.appendChild(fork);
            }
            document.body.appendChild(container);
        }
    }
}

export { render_repos };