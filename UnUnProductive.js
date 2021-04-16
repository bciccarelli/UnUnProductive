var ignoreNextRequest = {

};
var productiveSites = ["https://google.com"];
var unproductiveSites = ["youtube.com"];

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
    return { redirectUrl: randomArray(productiveSites) }
}
function randomArray(a) {
    return a[Math.floor(Math.random() * a.length)];
}
function getSiteList() {
    productiveSites = browser.storage.local.get("productive")
    unproductiveSites = browser.storage.local.get("unproductive")
    return [productiveSites, unproductiveSites]
}
function setSiteList(pList, upList) {
    browser.storage.local.set({"productive": pList})
    browser.storage.local.set({"unproductive": upList})
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

function receiveMessage(request) {
    if(request.operation == "update") {
        
    }
}
function onerror(e) {
    console.log(e)
}

listen()
browser.runtime.onMessage.addListener(receiveMessage);