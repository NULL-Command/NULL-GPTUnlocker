importScripts('crypto-js.min.js');
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == 'unlock') {
        var dataObj = {};
        const email = message.data.email;
        const continuousUnlock = message.data.continuousUnlock;
        function refetchurl() {
            fetch('https://gpteam-openfxt.vercel.app/unlock_key_source/second_source.txt', { cache: 'no-cache', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } })
                .then(response => response.text())
                .then(data => {
                    dataObj = extractAndPrintInfo(data)
                    fetch(dataObj.url, {
                        method: "POST",
                        headers: {
                            "accept": "*/*",
                            "accept-language": "en-US,en;q=0.9",
                            "authorization": dataObj.authorization,
                            "chatgpt-account-id": dataObj.chatgptAccountId,
                            "content-type": "application/json",
                            "oai-device-id": dataObj.oaiDeviceId,
                            "oai-language": "en-US",
                            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "cookie": dataObj.cookie,
                            "Referer": "https://chat.openai.com/",
                            "Referrer-Policy": "strict-origin-when-cross-origin"

                        },
                        body: JSON.stringify({
                            "email_addresses": [email],
                            "role": "standard-user",
                            "resend_emails": false
                        })
                    })
                        .then(response => {
                            if (response.ok) {
                                sendResponse({ success: true, message: '1' });
                            } else {
                                sendResponse({ success: false, message: '2' });
                            }
                        })
                        .catch(error => sendResponse({ success: false, message: '2' }));
                })
                .catch(error => sendResponse({ success: false, message: '3' }));
        }

        fetch('https://gpteam-openfxt.vercel.app/unlock_key_source/first_source.txt', { cache: 'no-cache', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } })
            .then(response => response.text())
            .then(data => {
                dataObj = extractAndPrintInfo(data)
                fetch(dataObj.url, {
                    method: "POST",
                    headers: {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "authorization": dataObj.authorization,
                        "chatgpt-account-id": dataObj.chatgptAccountId,
                        "content-type": "application/json",
                        "oai-device-id": dataObj.oaiDeviceId,
                        "oai-language": "en-US",
                        "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "cookie": dataObj.cookie,
                        "Referer": "https://chat.openai.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"

                    },
                    body: JSON.stringify({
                        "email_addresses": [email],
                        "role": "standard-user",
                        "resend_emails": false
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            sendResponse({ success: true, message: '1' });
                        } else {
                            refetchurl();
                        }
                    })
                    .catch(error => refetchurl());
            })
            .catch(error => refetchurl());
        if (continuousUnlock) {
            setInterval(() => {
                rein(dataObj, email);
            }, 3500);
        }
    }
    return true;
});

function rein(dataObj, email) {
    fetch(dataObj.url, {
        method: "POST",
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": dataObj.authorization,
            "chatgpt-account-id": dataObj.chatgptAccountId,
            "content-type": "application/json",
            "oai-device-id": dataObj.oaiDeviceId,
            "oai-language": "en-US",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": dataObj.cookie,
            "Referer": "https://chat.openai.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"

        },
        body: JSON.stringify({
            "email_addresses": [email],
            "role": "standard-user",
            "resend_emails": true
        })
    })
}


function extractAndPrintInfo(fetchedText) {
    const matches = fetchedText.match(/fetch\("(.+?)",\s*\{([\s\S]*?)\}\);/);
    const url = matches[1];
    const headersBody = matches[2];
    const headersMatches = headersBody.match(/"headers":\s*\{([\s\S]*?)\},\s*"body"/);
    const bodyMatches = headersBody.match(/"body":\s*"(\{[\s\S]*?\})"/);

    const headersText = headersMatches[1];
    const bodyText = bodyMatches[1];

    const authorization = headersText.match(/"authorization":\s*"(.+?)"/)[1];
    const chatgptAccountId = headersText.match(/"chatgpt-account-id":\s*"(.+?)"/)[1];
    const oaiDeviceId = headersText.match(/"oai-device-id":\s*"(.+?)"/)[1];
    const cookie = headersText.match(/"cookie":\s*"(.+?)"/)[1];

    return {
        url,
        authorization,
        chatgptAccountId,
        oaiDeviceId,
        cookie
    };
}
