window.onload = init();

function init() {
    chrome.storage.sync.get(["TOKEN"], function (setting) {
        document.getElementById("token").value = setting["TOKEN"] ? setting["TOKEN"] : "";
    })
}

document.getElementById("submit").addEventListener("click", setting)

function setting() {
    var token = document.getElementById("token").value;
    chrome.storage.sync.set(
        {
            "TOKEN": token,
        }
    );
    alert("Success");
}