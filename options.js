window.onload = init();

function init() {
    chrome.storage.sync.get(["TOKEN", "only_mine", "fullname", "dark_mode"], function (setting) {
        document.getElementById("token").value = setting["TOKEN"] ? setting["TOKEN"] : "";
        document.getElementById("dark_mode").checked = setting["dark_mode"];
    })
}

document.getElementById("submit").addEventListener("click", setting)

function setting() {
    var token = document.getElementById("token").value;
    var dark_mode = document.getElementById("dark_mode").checked;
    chrome.storage.sync.set(
        {
            "TOKEN": token,
            "dark_mode": dark_mode,
        }
    );
    alert("Success");
}