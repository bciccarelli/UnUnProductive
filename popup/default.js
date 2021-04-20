let thisInterval
var productiveSites = [];
var unproductiveSites = [];
var redirectEnabled = true;
function onoff(){
    browser.runtime.sendMessage({"operation": "enabledUpdate", "enabled": true})
}
function pSiteList(){
    pSiteListElement.style.display = pSiteListElement.style.display == "none" ? "block" : "none"
}
function upSiteList(){
    upSiteListElement.style.display = upSiteListElement.style.display == "none" ? "block" : "none"
}
function onError(error) {
    console.log(`Error: ${error}`)
  }  

function receiveMessage(request) {
    if(request.operation == "listsUpdate") {
        productiveSites = request.pList
        unproductiveSites = request.upList
    }
    if(request.operation == "enabledUpdate") {
        redirectEnabled = request.enabled
    }
}
function sendUpdate(){
    browser.runtime.sendMessage({"operation": "listsUpdate", "pList": ["http://coolmath.com"], "upList": ["youtube.com"]})
}
function requestCurrent(){
    browser.runtime.sendMessage({"operation": "getLists"})
    browser.runtime.sendMessage({"operation": "getEnabled"})
}
/*
browser.webRequest.onBeforeRequest.addListener(
    ()=>{return{redirectUrl: "myspace.com"}},             // function
    {},               //  object
    ["blocking"]         //  optional array of strings
  )*/

function startup() {
    browser.runtime.onMessage.addListener(receiveMessage);
    pSiteListElement = document.getElementById("pSiteList")
    upSiteListElement = document.getElementById("upSiteList")
    document.getElementById("onoff").onclick = onoff
    document.getElementById("pOpenList").onclick = pSiteList
    document.getElementById("upOpenList").onclick = upSiteList
    requestCurrent()
    sendUpdate()
}
startup()