function redirect() {
    console.log("request!!")
    return {redirectUrl: "myspace.com"}
}

browser.webRequest.onBeforeRequest.addListener(
    function(info) {
        console.log(info);
        return {cancel: true};
    }, {
        urls: ['<all_urls>'],
    },
    ['blocking']
);

browser.webRequest.onBeforeRequest.dispatchEvent(new Event("onBeforeRequest"));

function receiveMessage(request) {
    if(request.operation == "update") {
    }
}
function onerror(e) {
    console.log(e)
}

browser.runtime.onMessage.addListener(receiveMessage);