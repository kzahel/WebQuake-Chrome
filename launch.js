document.addEventListener("DOMContentLoaded",onready)
var reload = chrome.runtime.reload
var localServer = false
function getel(id) { return document.getElementById(id) }
window.delay = 1000
window.g_retained = []
window.g_paks = {}
function onstorage(items) {
  console.log('storage',items)
  return
  if (items.retained) {
    // restore all retained entries
    console.log('need to restore entries',items.retained)
    g_retained = items.retained

    for (var i=0; i<items.retained.length; i++) {
      var s = items.retained[i]
      console.log('restore entry',s)
      chrome.fileSystem.restoreEntry(s, function(entry) {
        console.log('entry restored',entry)
        g_paks[entry] = entry
      })
    }
  }
}

function onready() {
  chrome.storage.local.get(null, onstorage)
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
									 deleteServerSockets()
								 })
							 })
}

function save_store(entry,cb) {
  function onfile(file) {
    var fr = new FileReader
    fr.onload = fr.onerror = function(e) {
      console.log('read file',e)
      var buf = e.target.result
      Store.set(entry.name.toUpperCase(), buf)
      if (cb) cb()
    }
    fr.readAsArrayBuffer(file.slice())
  }


  entry.file( onfile, onfile )
}

function addpak() {
  chrome.fileSystem.chooseEntry({type:'openFile',
                                 acceptsMultiple:false,
                                 accepts:[{extensions:['pak']}]},
                                onfile)
  function onfile(entry) {
    console.log('got entry',entry)
    save_store(entry)
    var s = chrome.fileSystem.retainEntry(entry)
    g_retained.push(s)
    chrome.storage.local.set({'retained':g_retained})
  }
}

function setup_events() {

	getel('launch-server').addEventListener('click', onlaunchserver)
    
    getel('launch').addEventListener('click', launchQuake)
    getel('addfiles').addEventListener('click', addpak)

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
