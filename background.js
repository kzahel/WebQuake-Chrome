console.log('background.js')
chrome.app.runtime.onLaunched.addListener(function(launchData) {
	onstarted()
})

chrome.runtime.onMessage.addListener( function(message) {
	if (message == 'restart_server') {
		setTimeout( doserver, 1 )
	}
})

function onstarted() {
	launch()

}

function launch() {
    chrome.app.window.create('launch.html',
                             { defaultWidth: 512,
                               id:'WebQuake-launch',
                               defaultHeight: 384  },
                             function(w) {
                                 console.log('window created');
                             })
}
function doserver() {
	var server = chrome.app.window.get('server')
	if (server) {
		console.log('closing server window')
		server.close()
		setTimeout( doserver, 500 )
		return
	}

	//var arg = encodeURIComponent('+ map start')
	var arg = ''
    chrome.app.window.create('server/server.html?' + arg,
                             { defaultWidth: 512,
                               id:'server',
							   hidden: true,
                               defaultHeight: 384  },
                             function(w) {
                                 console.log('server window created');
								 w.onClosed.addListener( function() {
									 console.log('server window closed')
									 localServer = false
								 })
                             })

}

var reload = chrome.runtime.reload
