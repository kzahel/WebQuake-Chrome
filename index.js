// foo

var webview = document.getElementById('webview')

var decidePermission = function(e) {
    e.request.allow();
}

webview.addEventListener('permissionrequest', function(e) {
    console.log('permissionrequest',e)
    if ( e.permission === 'pointerLock' ) {
    // Calling e.preventDefault() is necessary to delay the response.
    // If the default is not prevented then the default action is to
    // deny the permission request.
        e.preventDefault();
        setTimeout(function() { decidePermission(e); }, 0);
    }
});