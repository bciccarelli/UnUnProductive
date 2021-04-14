let thisInterval
function onoff(){
    
}

function onError(error) {
    console.log(`Error: ${error}`);
  }  

function receiveMessage(request) {
    
    console.log(request.operation)
    if(request.operation == "update") {
        var query = { active: true, currentWindow: true };
        function callback(tabs) {
            if(tabs[0].id == request.tabID) {
                let endTime = request.endTime;
                startCountdown(endTime);
            }
        }
        browser.tabs.query(query, callback)
    }
}
function checkUpdate(){
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
        browser.runtime.sendMessage({"operation": "update", "tabID": tabs[0].id})
    }
    browser.tabs.query(query, callback)
}
/*
browser.webRequest.onBeforeRequest.addListener(
    ()=>{return{redirectUrl: "myspace.com"}},             // function
    {},               //  object
    ["blocking"]         //  optional array of strings
  )*/
browser.runtime.onMessage.addListener(receiveMessage);
document.getElementById("onoff").onclick = onoff
document.getElementById("list").onclick = list
checkUpdate()