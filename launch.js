document.addEventListener("DOMContentLoaded",onready)
window.delay = 1000
function onready() {
    chrome.runtime.getBackgroundPage( function(bg) {
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
            var disablesound = document.getElementById('disablesound').checked

            chrome.app.window.create('index.html?port=' + bg.app.port + '&delay=' + delay + '&disablesound=' + disablesound,
                                     { defaultWidth: 512,
                                       id:'WebQuake',
                                       defaultHeight: 384  },
                                     function(w) {
                                         console.log('quake window created');
                                     })
        })
    })
}
