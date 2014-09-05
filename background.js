
chrome.app.runtime.onLaunched.addListener(function(launchData) {
    console.log('quake app launch')
    
    //var args = "+skill 3 +map start"
    var args = "";
    
    //chrome.app.window.create('Client/WebQuake.htm' + '?' + encodeURIComponent(args),
    chrome.app.window.create('launch.html',
                             { defaultWidth: 512,
                               id:'WebQuake-launch',
                               defaultHeight: 384  },
                             function(w) {
                                 console.log('window created');
                             })

    chrome.runtime.onMessage.addListener( function(msg) {
	console.log('got msg from ext',msg)
    })


    chrome.runtime.getPackageDirectoryEntry( function(entry) {
        window.fs = new FileSystem(entry)
    })

    var handlers = [
        ['.*', DirectoryEntryHandler]
    ]

    var app = new chrome.WebApplication({handlers:handlers, host:'127.0.0.1', port:8682}) // TODO auto port finding
    app.start()
    window.app = app

})
