chrome.app.runtime.onLaunched.addListener(function(launchData) {
	onstarted()
})

function onstarted() {
    chrome.app.window.create('launch.html',
                             { defaultWidth: 512,
                               id:'WebQuake-launch',
                               defaultHeight: 384  },
                             function(w) {
                                 console.log('window created');
                             })

}
