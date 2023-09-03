class RepoManager {
    constructor(repos, username) {
        this.repos = repos;
        this.render_repos = repos;
        this.username = username;
    }

    repoFilter() {
        let only_mine = document.getElementById("only_mine").checked;
        let language = document.getElementById("language").options[document.getElementById("language").selectedIndex].value;
        let search = document.getElementById("search").value;
        let filtered_repos = this.repos;
        if (only_mine) {
            filtered_repos = filtered_repos.filter(repo => repo["owner"]["login"] == this.username);
        }
        if (language) {
            filtered_repos = filtered_repos.filter(repo => repo["language"] == language)
        }
        if (search) {
            filtered_repos = filtered_repos.filter(repo => repo["name"].includes(search) || (repo["description"] && repo["description"].includes(search)));
        }
        this.render_repos = filtered_repos;
    }

    makeRepoAvatar(owner) {
        const avatar = document.createElement("a");
        avatar.setAttribute("href", owner["html_url"]);
        avatar.setAttribute("target", "_blank");
        const avatar_img = document.createElement("img");
        avatar_img.setAttribute("src", owner["avatar_url"]);
        avatar.appendChild(avatar_img);
        return avatar;
    }

    makeRepoLink(repo) {
        const link = document.createElement("a");
        link.href = repo["html_url"];
        link.setAttribute("target", "_blank");
        const fullname_field = document.getElementById("fullname");
        link.innerText = fullname_field.checked ? repo["full_name"] : repo["name"];
        return link;
    }

    makeInfoBox(repo) {
        const info_box = document.createElement("div");
        info_box.classList.add("info-box");
        const fullname = document.createElement("p");
        fullname.innerText = "Name: " + repo["full_name"];
        info_box.appendChild(fullname);
        const description = document.createElement("p");
        description.innerText = "Description: " + repo["description"];
        info_box.appendChild(description);
        const language = document.createElement("p");
        language.innerText = "Language: " + repo["language"];
        info_box.appendChild(language);
        return info_box;
    }

    makeForkIcon() {
        const fork = document.createElement("img");
        fork.classList.add("fork");
        fork.setAttribute("src", "./imgs/fork.png");
        return fork;
    }

    makeIssueIcon(link) {
        const issue = document.createElement("a");
        issue.href = link;
        issue.setAttribute("target", "_blank");
        const issue_icon = document.createElement("img");
        issue_icon.classList.add("issue");
        issue_icon.setAttribute("src", "./imgs/issue.png");
        issue.appendChild(issue_icon);
        return issue;
    }

    makePrIcon(link) {
        const pr = document.createElement("a");
        pr.href = link;
        pr.setAttribute("target", "_blank");
        const pr_icon = document.createElement("img");
        pr_icon.classList.add("pr");
        pr_icon.setAttribute("src", "./imgs/pr.png");
        pr.appendChild(pr_icon);
        return pr;
    }

    renderRepos() {
        this.repoFilter();
        const container = document.getElementById("container");
        container.innerHTML = "";
        for (let i = 0; i < this.render_repos.length; i++) {
            const repo = this.render_repos[i];

            const repo_container = document.createElement("div");
            repo_container.classList.add("repo-container");
            repo_container.appendChild(this.makeRepoAvatar(repo["owner"]));
            repo_container.appendChild(this.makeRepoLink(repo));
            repo_container.appendChild(this.makeInfoBox(repo));
            if (repo["fork"]) {
                repo_container.appendChild(this.makeForkIcon());
            }
            repo_container.appendChild(this.makeIssueIcon(repo["html_url"] + "/issues"));
            repo_container.appendChild(this.makePrIcon(repo["html_url"] + "/pulls"));
            container.appendChild(repo_container);
        }
    }
}

export { RepoManager };