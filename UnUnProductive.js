var ignoreNextRequest = {

};

function redirect(details) {
    if (details.method != 'GET') {
        return {};
    }
    var timestamp = ignoreNextRequest[details.url];
	if (timestamp) {
		delete ignoreNextRequest[details.url];
		return {};
	}
    if(details.documentUrl == "https://myspace.com/") {
        return {};
    }
    console.log("request!!")
    ignoreNextRequest[details.documentUrl] = new Date().getTime();
    chrome.webRequest.onBeforeRequest.removeListener(redirect)
    setTimeout(listen, 1000)
    return { redirectUrl: "https://myspace.com/" }
}
function listen() {
    browser.webRequest.onBeforeRequest.addListener(
        redirect, {
            urls: ["https://*/*", "http://*/*"]
        },
        ['blocking']
    );
}
listen()

function receiveMessage(request) {
    if(request.operation == "update") {
    }
}
function onerror(e) {
    console.log(e)
}

browser.runtime.onMessage.addListener(receiveMessage);