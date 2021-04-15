var ignoreNextRequest = {

};
var unproductiveSites = ["youtube.com"];

var productiveSites = ["https://google.com"];

function redirect(details) {
    url = details.url
    if (details.method != 'GET') {
        return {};
    }
    splitUrl = url.split("/")[2]; 
    parsed = psl.parse(splitUrl);
    console.log(parsed.domain);
    if(!unproductiveSites.includes(parsed.domain)) {
        return {};
    }
    console.log("request!!")
    chrome.webRequest.onBeforeRequest.removeListener(redirect)
    setTimeout(listen, 1000)
    return { redirectUrl: productiveSites[0] }
}
function listen() {
    browser.webRequest.onBeforeRequest.addListener(
        redirect, {
            urls: ["https://*/*", "http://*/*"],
            types: ["main_frame"]
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