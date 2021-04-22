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
    link.href = repo["html_url"];
    link.setAttribute("target", "_blank");
    link.innerText = fullname ? repo["full_name"] : repo["name"]
    return link;
}

function make_info_box(repo, dark_mode) {
    var info_box = document.createElement("div");
    info_box.classList.add("info-box");
    if (dark_mode) {
        info_box.classList.add("dark_mode");
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

function make_fork_icon(dark_mode) {
    var fork = document.createElement("img");
    fork.classList.add("fork");
    if (dark_mode) {
        fork.setAttribute("src", "./imgs/fork/dark.png");
    }
    else {
        fork.setAttribute("src", "./imgs/fork/light.png");
    }
    return fork;
}

function make_issue_icon(link, dark_mode) {
    var issue = document.createElement("a");
    issue.href = link;
    issue.setAttribute("target", "_blank");
    var issue_icon = document.createElement("img");
    issue_icon.classList.add("issue");
    if (dark_mode) {
        issue_icon.setAttribute("src", "./imgs/issue/dark.png");
    }
    else {
        issue_icon.setAttribute("src", "./imgs/issue/light.png");
    }
    issue.appendChild(issue_icon);
    return issue;
}

function make_pr_icon(link, dark_mode) {
    var pr = document.createElement("a");
    pr.href = link;
    pr.setAttribute("target", "_blank");
    var pr_icon = document.createElement("img");
    pr_icon.classList.add("pr");
    if (dark_mode) {
        pr_icon.setAttribute("src", "./imgs/pr/dark.png");
    }
    else {
        pr_icon.setAttribute("src", "./imgs/pr/light.png");
    }
    pr.appendChild(pr_icon);
    return pr;
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
                    container.appendChild(make_fork_icon(dark_mode));
                }
                container.appendChild(make_issue_icon(repo["html_url"] + "/issues", dark_mode));
                container.appendChild(make_pr_icon(repo["html_url"] + "/pulls", dark_mode));
                document.body.appendChild(container);
            }
        }

    }
    request.setRequestHeader("Authorization", "token " + TOKEN);
    request.send();
}

export { render_repos };