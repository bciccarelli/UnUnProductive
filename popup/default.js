let thisInterval
var productiveSites = [];
var unproductiveSites = [];
var redirectEnabled = true;
function enableFunction(){
    redirectEnabled = !redirectEnabled
    browser.runtime.sendMessage({"operation": "enabledUpdate", "enabled": redirectEnabled})
    updateEnabledElement()
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
    pSiteListElement.textContent = ""
    for(var i in productiveSites) {
        createInputBox(pSiteListElement, productiveSites[i], shouter)
    }
    createInputBox(pSiteListElement, "", shouter)

    upSiteListElement.textContent = ""
    for(var i in productiveSites) {
        createInputBox(upSiteListElement, unproductiveSites[i], shouter)
    }
    createInputBox(upSiteListElement, "", shouter)

}
function updateEnabledElement() {
    enabledElement.textContent = redirectEnabled ? "Disable" : "Enable"
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
        updateEnabledElement()
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
    enabledElement = document.getElementById("enableElement")
    enabledElement.onclick = enableFunction
    document.getElementById("pOpenList").onclick = pOpenList
    document.getElementById("upOpenList").onclick = upOpenList
    requestCurrent()
    sendListUpdate()
}
startup()