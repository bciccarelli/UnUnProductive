var ignoreNextRequest = {

};
var redirectEnabled = true;
var productiveSites = [""];
var unproductiveSites = [""];

function redirect(details) {
    if(!redirectEnabled) {
        return
    }
    url = details.url
    if (details.method != 'GET') {
        return {};
    }
    splitUrl = url.split("/")[2]; 
    parsed = psl.parse(splitUrl);
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
async function getEnabled() {
    enabled = (await browser.storage.local.get("redirectEnabled"))["redirectEnabled"]
    return enabled
}
async function setEnabled(enabled) {
    await browser.storage.local.set({"redirectEnabled": enabled})
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
        case "listsUpdate":
            setSiteList(request.pList, request.upList).then((i)=>{updateLocalLists()})
            break;
        case "getLists":
            getSiteList().then((i)=>{sendListUpdate(i)})
            break;
        case "enabledUpdate":
            redirectEnabled = !redirectEnabled
            setEnabled(redirectEnabled)
            break;
        case "getEnabled":
            getEnabled().then((i)=>{sendEnabledUpdate(i)})
            break;
    }
}
function updateLocalLists() {
    getSiteList().then((a)=>{
        productiveSites = a[0]
        unproductiveSites = a[1]
    })
}
function updateLocalEnabled() {
    getEnabled().then((a)=>{
        redirectEnabled = a
    })
}
function sendListUpdate(listStorage) {
    browser.runtime.sendMessage({
        "operation": "listsUpdate",
        "pList": listStorage[0],
        "upList": listStorage[1]
    })
}
function sendEnabledUpdate(enabled) {
    browser.runtime.sendMessage({
        "operation": "enabledUpdate",
        "enabled": enabled
    })
}
function onerror(e) {
    console.log(e)
}

async function startup() {
    getEnabled().then((i) => {
        if(i != false && !i) {
            redirectEnabled = true
            setEnabled(true)
        }
    })
    getSiteList().then((i) => {
        if(Array.isArray(i[0])) {
            setSiteList([""], null)
        }
        if(Array.isArray(i[1])) {
            setSiteList(null, [""])
        }
    })
    
    updateLocalLists()
    updateLocalEnabled()
    listen()
    browser.runtime.onMessage.addListener(receiveMessage);
}
startup()