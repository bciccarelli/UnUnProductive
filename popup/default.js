let thisInterval
var productiveSites = [];
var unproductiveSites = [];
var redirectEnabled = true;
function onoff(){
    browser.runtime.sendMessage({"operation": "enabledUpdate", "enabled": true})
}
function pOpenList(){
    pSiteListElement.style.display = pSiteListElement.style.display == "none" ? "block" : "none"
}
function upOpenList(){
    upSiteListElement.style.display = upSiteListElement.style.display == "none" ? "block" : "none"
}
function onError(error) {
    console.log(`Error: ${error}`)
}
function shouter() {
    console.log("SHOUTING")
}
function updateListElements(){
    pSiteListElement.innerHTML = ""
    for(var i in productiveSites) {
        createInputBox(pSiteListElement, productiveSites[i], shouter)
    }
    createInputBox(pSiteListElement, "", shouter)

    upSiteListElement.innerHTML = ""
    for(var i in productiveSites) {
        createInputBox(upSiteListElement, unproductiveSites[i], shouter)
    }
    createInputBox(upSiteListElement, "", shouter)

}
function createInputBox(parent, value, changeEvent) {
    inputElement = document.createElement("input")
    inputElement.value = value
    inputElement.addEventListener("input", changeEvent)
    parent.appendChild(inputElement)
}
function receiveMessage(request) {
    if(request.operation == "listsUpdate") {
        productiveSites = request.pList
        unproductiveSites = request.upList
        updateListElements()
        console.log([productiveSites, unproductiveSites])
    }
    if(request.operation == "enabledUpdate") {
        redirectEnabled = request.enabled
    }
}
function sendUpdate(){
    browser.runtime.sendMessage({"operation": "listsUpdate", "pList": ["http://forex.com"], "upList": ["youtube.com"]})
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
    document.getElementById("pOpenList").onclick = pOpenList
    document.getElementById("upOpenList").onclick = upOpenList
    requestCurrent()
    sendUpdate()
}
startup()