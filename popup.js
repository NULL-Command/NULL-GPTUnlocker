async function sendMessage() {
    let email = document.getElementById('emailInput').value;
    let continuousUnlock = document.getElementById('i').checked;
    chrome.runtime.sendMessage({
        type: 'unlock',
        data: {
            email: email,
            continuousUnlock: continuousUnlock
        }
    }).then(response => {
        if (response.message === '1') {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currentTab = tabs[0];
                setTimeout(function () {
                    chrome.tabs.reload(currentTab.id);
                }, 1500);
            });
            alert('Successfully unlocking GPT Plus, please reload the ChatGPT page and select the correct Team workspace (not personal) to use. Thank you for your interest and use of OpenFXT\'s services.');
        } else if (response.message === '2') {
            alert('Unlock failed, the server\'s unlock key has expired, please wait for the unlock key to be updated!')
        } else {
            alert('A major outage error occurred on the extension, please contact OpenFXT to respond to the error immediately. Thank you for your interest and use of OpenFXT\'s services.')
        }
    }).catch(error => {
        alert('The extension suddenly stopped, please contact OpenFXT to respond to the issue. Thank you for your interest and use of OpenFXT\'s services.');
    });

}

document.getElementById('unlockButton').addEventListener('click', sendMessage);
