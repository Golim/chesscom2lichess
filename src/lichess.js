function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Receive a message from the extension
browser.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    try {
        // If the message is a PGN
        if (request.pgn) {
            // Set the PGN in the textarea
            while (document.getElementsByName("pgn")[0] == null)
                await sleep(0.5);
            document.getElementsByName("pgn")[0].value = request.pgn;

            // Set the "Analyse" checkbox to true
            while (document.getElementsByName("analyse")[0] == null)
                await sleep(0.5);

            // Get the "Analyse" setting from the extension
            browser.storage.sync.get("analysis", function(result) {
                document.getElementsByName("analyse")[0].checked = result.analysis;
            });
            await sleep(0.5);

            // Click the "Submit" button
            while (document.getElementsByClassName("submit")[0] == null)
                await sleep(0.5);
            document.getElementsByClassName("submit")[0].click();
        } else {
            console.log("ERROR: Received a message from the extension, but it was not a PGN.");
        }
    } catch (e) {
        console.log("ERROR: Failed to send PGN to Lichess.");
        console.log(e);
    }

    // Send a response
    sendResponse(undefined);
});