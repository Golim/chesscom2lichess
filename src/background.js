// Open a new tab when receiving a message from the chesscom script
browser.runtime.onMessage.addListener((pgn) => {
    // Open a tab with lichess.org
    let creating = browser.tabs.create({
        url: "https://lichess.org/paste"
    });

    // Wait for the tab to be created
    creating.then((tab) => {
        // Wait for the tab to load
        browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tabInfo) {
            if (tabId == tab.id && changeInfo.status == "complete") {
                browser.tabs.onUpdated.removeListener(listener);
                // Send the PGN to the tab
                browser.tabs.sendMessage(tab.id, {pgn: pgn});
            }
        });
    });
});