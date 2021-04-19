function init() {
    chrome.storage.sync.get(["TOKEN"], function(data){
        var TOKEN = data["TOKEN"]
        if (TOKEN) {
            var msg = document.createElement("p");
            msg.innerText = "loading...";
            document.body.appendChild(msg);

            var request = new XMLHttpRequest();
            request.open("GET", "https://api.github.com/user/repos?per_page=100&visibility=all&sort=updated");
            request.onreadystatechange = function() {
                var repos = JSON.parse(request.responseText);
                console.log(request.responseText);
                render_repos(repos);
            }
            request.setRequestHeader("Authorization", "token "+TOKEN);
            request.send();
        }
        var btn = document.createElement("button");
        btn.innerText = "setting";
        document.body.appendChild(btn);
        btn.addEventListener("click", function() {chrome.tabs.create({"url": "option.html"})});
    })
}

window.onload = init();

function set_token() {
    var input = document.getElementById("token_field");
    var TOKEN = input.value;
    chrome.storage.sync.set({"TOKEN": TOKEN});
    input.value = "OK";
}

function render_repos(repos) {
    
}
