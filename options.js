window.onload = init();

function init(){
    chrome.storage.sync.get(["TOKEN", "only_mine", "fullname"], function(setting){
        document.getElementById("token").value = setting["TOKEN"] ? setting["TOKEN"] : "";
        document.getElementById("only_mine").checked = setting["only_mine"];
        document.getElementById("fullname").checked = setting["fullname"];
    })
}

document.getElementById("submit").addEventListener("click", setting)

function setting() {
    var token = document.getElementById("token").value;
    var only_mine = document.getElementById("only_mine").checked;
    var fullname = document.getElementById("fullname").checked;
    chrome.storage.sync.set(
        {
            "TOKEN": token,
            "only_mine": only_mine,
            "fullname": fullname
        }
    );
    alert("Success");
}