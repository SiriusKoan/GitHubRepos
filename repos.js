function make_repo_avatar(owner) {
    var avatar = document.createElement("a");
    avatar.setAttribute("href", owner["html_url"]);
    avatar.setAttribute("target", "_blank")
    var avatar_img = document.createElement("img");
    avatar_img.setAttribute("src", owner["avatar_url"]);
    avatar.appendChild(avatar_img);
    return avatar;
}

function make_repo_link(repo) {
    var link = document.createElement("a");
    link.setAttribute("href", repo["html_url"]);
    link.setAttribute("target", "_blank")
    link.innerText = repo["name"];
    return link
}

function render_repos(repos) {
    for (let i = 0; i < repos.length; i++) {
        var repo = repos[i];
        var container = document.createElement("p");
        container.appendChild(make_repo_avatar(repo["owner"]));
        container.appendChild(make_repo_link(repo));
        document.body.appendChild(container);
    }
}

export { render_repos };