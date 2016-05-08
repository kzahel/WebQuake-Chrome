
function deleteServerSockets() {
	chrome.sockets.tcpServer.getSockets(function(infos) {
		infos.forEach( function(info) {
			chrome.sockets.tcpServer.close(info.socketId,
										   function(i) { console.log('closed server socket',i) })
		})
	})
}
