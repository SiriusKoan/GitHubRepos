function init() {
    chrome.storage.sync.get(["TOKEN"], function(data){
        var TOKEN = data["TOKEN"]
        if (TOKEN == undefined) {
            var input = document.createElement("input");
            input.setAttribute("id", "token_field");
            document.body.appendChild(input);
            var btn = document.createElement("button");
            btn.setAttribute("id", "token_input");
            btn.innerText = "Enter";
            document.body.appendChild(btn);
            btn.addEventListener("click", set_token);
        }
    })
}
window.onload = init();

function set_token() {
    var input = document.getElementById("token_field");
    var TOKEN = input.value;
    chrome.storage.sync.set({"TOKEN": TOKEN});
    input.value = "OK";
}
