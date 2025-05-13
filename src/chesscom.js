function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function openTab() {
    share = document.getElementsByClassName("share")[0]
    if (share == null) {
        // Most likely we are in Zen mode
        minimize = document.getElementsByClassName("board-layout-icon icon-font-chess minimize")[0]
        if (minimize == null) {
            // We are not in Zen mode
            console.log("ERROR: Could not find the share button.");
            return;
        }
        minimize.click();
        while (document.getElementsByClassName("share")[0] == null)
            await sleep(0.5);
        share = document.getElementsByClassName("share")[0];
    }

    // Open the share interface on chess.com and get the PGN
    share.click();

    // Wait for the share menu to be loaded
    while (document.getElementsByClassName("share-menu-tab-image-component")[0] == null)
        await sleep(0.5);

    // Get the "PGN" tab button
    const tabPgn = document.getElementById("tab-pgn");
    if (tabPgn == null) {
        console.log("ERROR: Could not find the tab-pgn element.");
        return;
    }
    tabPgn.click();

    // Wait for the PGN to be loaded
    while (document.getElementsByClassName("share-menu-tab-pgn-textarea")[0] == null)
        await sleep(0.5);

    // Get the "Timestamps" setting from the extension
    browser.storage.sync.get("timestamps", async function (result) {
        if (result.timestamps) {
            while (document.getElementsById("tab-pgn-timestamps")[0] == null)
                await sleep(0.5);
            document.getElementsById("tab-pgn-timestamps")[0].click();
            // Wait for the PGN to be loaded
            await sleep(0.5);
        }
    });

    // Get a textarea named pgn
    const textarea = document.getElementsByClassName("share-menu-tab-pgn-textarea")[0];
    const pgn = textarea.value;
    try {
        // Send a message to the background script
        browser.runtime.sendMessage(pgn);
    } catch (e) {
        console.log("ERROR", e);
    }
}

function createLichessAnalysisButton(id = 'lichess-analysis-button') {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    //                  cc-button-component cc-button-primary cc-button-xx-large cc-bg-primary cc-button-full
    button.className = 'cc-button-component cc-button-primary cc-button-xx-large cc-bg-primary cc-button-full';
    button.innerHTML = '<span class="lichess-icon"></span><span> Analyse on Lichess</span>';

    button.setAttribute('style', 'grid-column: span 2;');

    button.addEventListener('click', openTab);

    return button;
}

// Wait for an element to be added to the page
const onMutation = () => {
    // Add the Lichess Analysis button to the game-over popup, if it doesn't exist yet
    if (!document.getElementById('lichess-game-over-analysis-button')) {
        // If game-over-modal-buttons element exists, add the button there
        var element = document.getElementsByClassName('game-over-modal-buttons')[0];

        if (element) {
            // Create the Lichess analysis button
            button = createLichessAnalysisButton('lichess-game-over-analysis-button');

            // Add the button to the game-over-modal-buttons element
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'game-over-review-button-component';
            buttonContainer.appendChild(button);

            element.insertBefore(buttonContainer, element.children[0]);
        }
    }

    // Add the Lichest Analysis button to other elements, if it doesn't exist yet
    if (!document.getElementById('lichess-analysis-button')) {
        var element = null;
        if (element == null) {
            element = document.getElementsByClassName('game-review-buttons-component')[0];
        }
        if (element == null) {
            element = document.getElementsByClassName('game-review-buttons-focus-mode')[0];
        }
        if (element == null) {
            element = document.getElementsByClassName('game-controls-view-component')[0];
        }
        if (element == null) {
            element = document.getElementsByClassName('quick-analysis-buttons')[0];
        }

        if (element) {
            // Create the Lichess analysis button
            button = createLichessAnalysisButton();

            try {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'game-review-buttons-review';
                buttonContainer.appendChild(button);

                element.insertBefore(buttonContainer, element.children[0]);

                // Add a separator
                const separator = document.createElement('div');
                separator.className = 'game-review-buttons-separator';
                separator.innerHTML = '&nbsp;';
                element.insertBefore(separator, element.children[1]);
            } catch (e) {
                console.log("Failed to add Lichess Analysis button.");
                console.log(e);
            }
        }
    }
}

const observer = new MutationObserver(onMutation)

observer.observe(document.body, {
    childList: true,
    subtree: true
})