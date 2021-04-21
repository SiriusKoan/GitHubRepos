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

function make_info_box(repo, dark_mode) {
    var info_box = document.createElement("div");
    info_box.classList.add("info-box");
    if (dark_mode) {
        info_box.style.backgroundColor = "#152028";
        info_box.style.color = "#FFFFFF";
    }
    else {
        info_box.style.backgroundColor = "#FFFFFF";
        info_box.style.color = "#000000";
    }
    var fullname = document.createElement("p");
    fullname.innerText = "Name: " + repo["full_name"];
    info_box.appendChild(fullname);
    var description = document.createElement("p");
    description.innerText = "Description: " + repo["description"];
    info_box.appendChild(description);
    var language = document.createElement("p");
    language.innerText = "Language: " + repo["language"];
    info_box.appendChild(language);
    return info_box;
}

function render_repos(repos, only_mine, fullname, TOKEN, dark_mode) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.github.com/user");
    request.onreadystatechange = function () {
        var user = JSON.parse(request.responseText);
        var username = (request.status == 200) ? user["name"] : null;
        for (let i = 0; i < repos.length; i++) {
            var repo = repos[i];
            if (only_mine && username == repo["owner"]["login"] || !only_mine) {
                var container = document.createElement("div");
                container.classList.add("container");
                if (dark_mode) {
                    container.classList.add("dark_mode");
                }

                container.appendChild(make_repo_avatar(repo["owner"]));
                container.appendChild(make_repo_link(repo, fullname));
                container.appendChild(make_info_box(repo, dark_mode));
                if (repo["fork"]) {
                    var fork = document.createElement("img");
                    fork.setAttribute("src", "./imgs/fork.png");
                    container.appendChild(fork);
                }
                document.body.appendChild(container);
            }
        }

    }
    request.setRequestHeader("Authorization", "token " + TOKEN);
    request.send();
}

export { render_repos };