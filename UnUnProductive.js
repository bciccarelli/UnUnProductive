var ignoreNextRequest = {

};
var productiveSites = ["https://forex.com"];
var unproductiveSites = ["youtube.com", "coolmath.com"];

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
    chrome.webRequest.onBeforeRequest.removeListener(redirect)
    setTimeout(listen, 1000)
    return { redirectUrl: randomArray(productiveSites) }
}
function randomArray(a) {
    return a[Math.floor(Math.random() * a.length)];
}
async function getSiteList() {
    productiveSites = (await browser.storage.local.get("productive"))["productive"]
    unproductiveSites = (await browser.storage.local.get("unproductive"))["unproductive"]
    return [productiveSites, unproductiveSites]
}
async function setSiteList(pList, upList) {
    if(pList){await browser.storage.local.set({"productive": pList})}
    if(upList){await browser.storage.local.set({"unproductive": upList})}
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

async function receiveMessage(request) {
    switch(request.operation) {
        case "update":
            setSiteList(request.pList, request.upList).then((i)=>{updateLocalLists()})
            break;
        case "getLists":
            getSiteList().then((i)=>{sendListUpdate(i)})
            break;
    }
}
function updateLocalLists() {
    getSiteList().then((a)=>{
        console.log(a)
        productiveSites = a[0]
        unproductiveSites = a[1]
    })
}
function sendListUpdate(listStorage) {
    browser.runtime.sendMessage({
        "operation": "update",
        "pList": listStorage[0],
        "upList": listStorage[1]
    })
}
function onerror(e) {
    console.log(e)
}

listen()
browser.runtime.onMessage.addListener(receiveMessage);