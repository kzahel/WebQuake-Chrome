// lalala

function onDonate(evt) {
    console.log('onDonate',evt)
}
function onDonateFail(evt) {
    console.log('onDonateFail',evt)
}

document.getElementById('donate').addEventListener('click', function(evt) {
    var sku = "basicdonation";
    google.payments.inapp.buy({
        'parameters': {'env': 'prod'},
        'sku': sku,
        'success': onDonate,
        'failure': onDonateFail
    });
})

document.getElementById('launch').addEventListener('click', function(evt) {
    chrome.app.window.create('index.html',
                             { defaultWidth: 512,
                               id:'WebQuake',
                               defaultHeight: 384  },
                             function(w) {
                                 console.log('quake window created');
                             })
})