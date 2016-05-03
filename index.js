// foo
document.addEventListener('DOMContentLoaded', onready)

function decode_arguments_qp() {
    if (window.location.search) {
        var s = window.location.search.slice(1,window.location.search.length)
        var parts = s.split('&')
        var d = {}
        for (var i=0; i<parts.length; i++) {
            var sp = parts[i].split('=')
            d[decodeURIComponent(sp[0])] = decodeURIComponent(sp[1])
        }
    }
    return d
}

function onready() {
    // decode uri
    var params = decode_arguments_qp()
    var port = params.port || 8682
    //var args = "+skill 3 +map start"
    if (params.disablesound == 'true') {
        var args = '-nosound'
    } else {
        var args = "";
    }
    var startupstring = '?' + encodeURIComponent(args)
    var url = 'http://127.0.0.1:'+port+'/WebQuake/Client/WebQuake.htm' + startupstring +'#delay=' +params.delay
    var webview = document.createElement('webview')
    webview.src = url
    webview.sandbox = 'allow-pointer-lock'
    webview.style.width = '100%'
    webview.style.height = '100%'
    document.getElementById('container').appendChild(webview)
    //var webview = document.getElementById('webview')

    var decidePermission = function(e) {
        e.request.allow();
    }

    webview.addEventListener('permissionrequest', function(e) {
        //console.log('permissionrequest',e)
        if ( e.permission === 'pointerLock' ) {
            // Calling e.preventDefault() is necessary to delay the response.
            // If the default is not prevented then the default action is to
            // deny the permission request.
            //e.preventDefault();
            //setTimeout(function() { decidePermission(e); }, 0);


	    // delay seems no longer necessary
	    decidePermission(e)
        } else if (e.permission == 'fullscreen') {
            decidePermission(e)
        }
    });

}
