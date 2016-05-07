/*
Node = {
	dgram: require('dgram'),
	fs: require('fs'),
	http: require('http'),
	os: require('os'),
	url: require('url'),
	websocket: require('websocket')
};*/



console.log('server.js')
document.addEventListener("DOMContentLoaded",ondom)
var reload = function() {
	if (window.webapp) {
		webapp.stop('reload', function() {
			chrome.runtime.sendMessage('restart_server')
		})
	} else {
			chrome.runtime.sendMessage('restart_server')
	}

}

function wait_for_devtools( callback, giveup_after ) {
	giveup_after = giveup_after || 10
	var start = Date.now()
	var timeout
	var triggered = false
	var element = new Image();
	element.__defineGetter__('id', done)

	function done() {
		if (triggered) return ''
		console.log('devtools attached')
		triggered = true
		setTimeout(callback, 1) // its actually still not ready, need to do setTimeout
		return ''
	}
	
	function checkit() {
		if (triggered) { return }
		console.log('waiting for devtools...',element)
		if (Date.now() - start > giveup_after * 1000) {
			console.log('giving up, just going')
			callback()
		} else {
			timeout = setTimeout( checkit, 200 )
		}
	}
	checkit()
}


function ondom() {
	wait_for_devtools( go )
}

/*
Key = {Init:function(){}}
Chase = {Init:function(){}}
VID = {Init:function(){}}
Draw = {Init:function(){}}
SCR = {Init:function(){}}
R = {Init:function(){}}
S = {Init:function(){}}
M = {Init:function(){}}
CDAudio = {Init:function(){}}
Sbar = {Init:function(){}}
CL = {Init:function(){}}
IN = {Init:function(){}}
*/

function WrapFile(file) {
	this.file = file
	this.pos = 0
	this.length = this.file.length
}

function openSync(filename, mode) {
	if (PAKS[filename]) {
		return new WrapFile(PAKS[filename])
	}  else {
		throw new Error("Not found")
	}
}
function closeSync(fd) {
	// nothing
}

function readFileSync(filename) {
	if (PAKS[filename]) {
		return new Buffer(PAKS[filename])
	}  else {
		throw new Error("Not found")
	}
}

function readSync(src, dst, dst_offset, length, src_position) {
	var a = (src_position !== undefined) ? src_position : src.pos
	if (dst_offset === undefined) dst_offset = 0

	var slice = new Uint8Array(src.file.slice(a, a+length))
	dst.set(slice, dst_offset)
}

function stdoutwrite(msg) {
	console.log(msg)
}
process = { stdout: { write: stdoutwrite } }
Node = {
	dgram: window.ChromeUDP,
	websocket: {server:ChromeNodeWS},
	fs: {
		openSync: openSync,
		readSync: readSync,
		readFileSync: readFileSync,
		closeSync: closeSync
		
	},
	os: { hostname: function() { return navigator.platform } }
}
window.Datagram = null


//Loop = {Init:function(){}} // loopback?


function decode_arguments_hash() {
    var hash = window.location.hash.slice(1,window.location.hash.length)
    if (hash.length == 0) {
        return {}
    }
    var parts = hash.split('&')
    var args = {}

    for (var i=0; i<parts.length; i++) {
        var kv = parts[i].split('=')
        args[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1])
    }
    console.log('location hash args',args)
    return args
}

var PAKS = {
}
//Sys.framerate = 60.0
Sys.framerate = 2.0
Sys.dedicated = true
function go() {
	//Sys.main()
	readfile('pak0.pak', 'id1/pak0.pak', function() {
		readfile('pop.lmp','id1/gfx/pop.lmp', function() {
			Sys.main()
		})
	})
	
}



function readfile(name, dst, cb) {

	chrome.runtime.getPackageDirectoryEntry(function(entry) {
		entry.getFile(name, {create:false}, function(fileentry) {
			function onfile(file) {
				if (file && file.size) {
					var fr = new FileReader
					fr.onload = fr.onerror = function(evt) {
						if (evt.type == 'load') {
							PAKS[dst] = evt.target.result
							cb(true)
						} else {
							cb(false)
						}
					}
					console.log('read blob',file)
					fr.readAsArrayBuffer(file.slice())
				} else {
					cb(false)
				}
			}
			fileentry.file( onfile, onfile )
		})
	})
}
