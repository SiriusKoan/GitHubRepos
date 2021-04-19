document.getElementById("token").addEventListener("click", save_token)

function save_token() {
    var input = document.getElementById("token_field");
    var TOKEN = input.value;
    chrome.storage.sync.set({"TOKEN": TOKEN});
    alert("Success");
}