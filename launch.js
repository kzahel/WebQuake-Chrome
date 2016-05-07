document.addEventListener("DOMContentLoaded",onready)
var localServer = false
function getel(id) { return document.getElementById(id) }
window.delay = 1000
function onready() {
	setup_events()
    chrome.runtime.getBackgroundPage( function(bg) {
        function onDonate(evt) {
            console.log('onDonate',evt)
        }
        function onDonateFail(evt) {
            console.log('onDonateFail',evt)
        }
        getel('donate').addEventListener('click', function(evt) {
            var sku = "basicdonation";
            google.payments.inapp.buy({
                'parameters': {'env': 'prod'},
                'sku': sku,
                'success': onDonate,
                'failure': onDonateFail
            });
        })

        chrome.runtime.getPlatformInfo(function(info) {
            if (info.arch == 'arm') {
                //document.getElementById('disablesound').checked = false
                //document.getElementById('armcrash').innerText = "Sound on ARM Chromebook may cause crashes.."
            }
        })

    })
}


function onlaunchserver() {
	//var params = encodeURIComponent('-dedicated +coop 1 +deathmatch 0 +teamplay 1 +map e1m1') // doesnt work
	params = ''
	chrome.app.window.create('server/server.html?' + params,
							 { defaultWidth: 512,
                               id:'server',
                               defaultHeight: 384  },
							 function(swin) {
								 swin.onClosed.addListener( function(evt) {
									 console.log('server window closed')
									 localServer = false
								 })
							 })
}

function setup_events() {

	getel('launch-server').addEventListener('click', onlaunchserver)
    
    getel('launch').addEventListener('click', launchQuake)

	function keydown(evt) {
        if (evt.metaKey || evt.ctrlKey) {
            if (evt.keyCode == 82) {
                // ctrl-r
                console.log('received ctrl(meta)-r, reload app')
                chrome.runtime.reload()
            }
            //evt.preventDefault() // dont prevent ctrl-w
        }
    }
    document.body.addEventListener('keydown', keydown)
}

function launchQuake() {
    var disablesound = getel('disablesound').checked

	if (false) {
		chrome.app.window.create('index.html?port=' + bg.app.port + '&delay=' + delay + '&disablesound=' + disablesound,
								 { defaultWidth: 640,
								   id:'WebQuake',
								   defaultHeight: 480  },
								 function(w) {
									 console.log('quake window created');
								 })
	} else {
		if (disablesound) {
			var params = '-nosound'
		} else {
			var params = ''
		}
		if (localServer) {
			params += ' +connect ws://127.0.0.1:26000'
		}
		params = encodeURIComponent(params)
		chrome.app.window.create('WebQuake-async/Client/WebQuake.htm?' + params,
								 { defaultWidth: 640,
								   id:'WebQuake',
								   defaultHeight: 480 },
								 function(w) {
									 console.log('quake window created');
									 w.onClosed.addListener( function() {
										 
										 
									 })
								 })
	}
}
