function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        analysis: document.querySelector("#analysis").checked
    });

    browser.storage.sync.set({
        timestamps: document.querySelector("#timestamps").checked
    });

    // Show a notification that the options were saved.
    var saved = document.getElementById("saved");
    saved.style.display = "block";
    setTimeout(function() { saved.style.display = "none"; }, 750);
}

function restoreOptions() {
    function setCurrentChoice(result) {
        console.log("setCurrentChoice", result);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    browser.storage.sync.get("analysis").then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
