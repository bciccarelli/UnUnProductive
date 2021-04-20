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
    pList = (await browser.storage.local.get("productive"))["productive"]
    upList = (await browser.storage.local.get("unproductive"))["unproductive"]
    return [pList, upList]
}
async function setSiteList(pList, upList) {
    if(pList){await browser.storage.local.set({"productive": pList})}
    if(upList){await browser.storage.local.set({"unproductive": upList})}
    return
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
            pList = request.pList
            upList = request.upList
            console.log(pList)
            updateLocalLists(pList, upList)
            await setSiteList(pList, upList)
            break;
        case "getLists":
            getSiteList().then((i)=>{sendListUpdate(i)})
            break;
        case "enabledUpdate":
            setEnabled(redirectEnabled).then((i)=>{updateLocalEnabled(i)})
            break;
        case "getEnabled":
            getEnabled().then((i)=>{sendEnabledUpdate(i)})
            break;
    }
    
}
async function updateLocalLists(pList, upList) {
    console.log(pList)
    if(pList){productiveSites = pList}
    if(upList){unproductiveSites = upList}
}
async function updateLocalEnabled(enabled) {
    if(enabled == true || enabled == false){redirectEnabled = enabled}
}
async function sendListUpdate(listStorage) {
    browser.runtime.sendMessage({
        "operation": "listsUpdate",
        "pList": listStorage[0],
        "upList": listStorage[1]
    })
}
async function sendEnabledUpdate(enabled) {
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
            updateLocalEnabled(true)
            setEnabled(true)
        } else {
            updateLocalEnabled(i)
        }
    })
    getSiteList().then((i) => {
        updateLocalLists(i[0], i[1])
        if(Array.isArray(i[0])) {
            setSiteList([""], null)
            updateLocalLists([""], null)
            return
        } 
        if(Array.isArray(i[1])) {
            setSiteList(null, [""])
            updateLocalLists(null, [""])
            return
        }
    })
    listen()
    browser.runtime.onMessage.addListener(receiveMessage);
}
startup()