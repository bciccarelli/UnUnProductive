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
function shouter(e) {
    readInputBoxes(e.target.parentElement)
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
function readInputBoxes(listElement) {
    tempList = []
    childrenList = listElement.children
    emptyFound = false
    for(i of childrenList) {
        if(i.value == "") {
            if(!emptyFound) {
                emptyFound = i
            } else {
                if(document.activeElement == i) {
                    emptyFound.focus()
                }
                listElement.removeChild(i) 
                continue;
            }
        } else {
            tempList.push(i.value)
        }
    }
    if(!emptyFound) {
        createInputBox(listElement, "", shouter)
    }
    if(listElement.id == "pSiteList") {
        sendListUpdate(tempList, null)
    } else {
        sendListUpdate(null, tempList)
    }
}
function receiveMessage(request) {
    if(request.operation == "listsUpdate") {
        productiveSites = request.pList
        unproductiveSites = request.upList
        updateListElements()
    }
    if(request.operation == "enabledUpdate") {
        redirectEnabled = request.enabled
    }
}
function sendListUpdate(pList, upList){
    browser.runtime.sendMessage({"operation": "listsUpdate", "pList": pList, "upList": upList})
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
    sendListUpdate()
}
startup()