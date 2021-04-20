let thisInterval
var productiveSites = [];
var unproductiveSites = [];
function onoff(){
    
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
    if(request.operation == "update") {
        productiveSites = request.pList
        unproductiveSites = request.upList
    }
}
function sendUpdate(){
    browser.runtime.sendMessage({"operation": "update", "pList": ["http://coolmath.com"], "upList": ["youtube.com"]})
}
function requestCurrentList(){
    browser.runtime.sendMessage({"operation": "getLists"})
}
/*
browser.webRequest.onBeforeRequest.addListener(
    ()=>{return{redirectUrl: "myspace.com"}},             // function
    {},               //  object
    ["blocking"]         //  optional array of strings
  )*/

browser.runtime.onMessage.addListener(receiveMessage);
pSiteListElement = document.getElementById("pSiteList")
upSiteListElement = document.getElementById("upSiteList")
document.getElementById("onoff").onclick = onoff
document.getElementById("pOpenList").onclick = pSiteList
document.getElementById("upOpenList").onclick = upSiteList
sendUpdate()
requestCurrentList()