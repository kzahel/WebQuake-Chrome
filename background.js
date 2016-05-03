chrome.app.runtime.onLaunched.addListener(function(launchData) {
    console.log('quake app launch')
    if (window.app) {
        onstarted()
    } else {
        chrome.runtime.onMessage.addListener( function(msg) {
	    console.log('got msg from ext',msg)
        })
        chrome.runtime.getPackageDirectoryEntry( function(entry) {
            var fs = new WSC.FileSystem(entry)
            var handlers = [
                ['.*', WSC.DirectoryEntryHandler.bind(null, fs)]
            ]
            var app = new WSC.WebApplication({optTryOtherPorts:true, handlers:handlers, host:'127.0.0.1', port:8682}) // TODO auto port finding
            app.start(onstarted)
            window.app = app
        })
    }
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
