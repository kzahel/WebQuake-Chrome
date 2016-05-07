(function() {
	function ExampleWebSocketHandler(n) {
		this.n = n
		WSC.WebSocketHandler.prototype.constructor.call(this)
	}
	var ExampleWebSocketHandler_prototype = {
		open: function() {
			console.log('websocket handler handler.open()',this.request)
			window.ws = this
			//this.ws_connection.mask_outgoing = false
			this.set_nodelay()
			this.n.trigger('request',this)
			this.origin = 'localhost'
			this.socket = this.request.connection.stream
			this.socket.remoteAddress = '???'
			//this.write_message("hello!")

			this.closeReasonCode = -1
			this._listeners = {}

		},
		drop: function(code) {
			this.close(code)
		},
		sendBytes: function(data) {
			if (! this.ws_connection) return -1
			//console.log('writing data',data.data.byteLength)
			this.write_message(data.buffer,true)
		},
		select_subprotocols: function(subprots) {
			this.requestedProtocols = subprots
			if (subprots.length > 0 && subprots[0] == 'quake') return 'quake'
		},
		reject: function() {
			this.close()
		},
		accept: function(subprot, origin) {
			return this
		},
		on_message: function(msg) {
			//console.log('got ws message',msg)
			//this.n.trigger('message',msg)
			this.trigger('message',{type:'binary',binaryData:msg})
			//this.write_message('pong')
		},
		on_close: function() {
			this.closeReasonCode = 100
			//this.n.trigger('close')
			this.trigger('close')

		},
		trigger: function(evt,data) {
			var l = this._listeners[evt]
			if (l && l.length > 0) {
				l.forEach( function(cb) { cb(data) } )
			}
		},
		on: function(evt, cb) {
			if (! this._listeners[evt])
				this._listeners[evt] = []
			this._listeners[evt].push(cb)
		}
	}
	for (var m in WSC.WebSocketHandler.prototype) {
		ExampleWebSocketHandler.prototype[m] = WSC.WebSocketHandler.prototype[m]
	}
	for (var m in ExampleWebSocketHandler_prototype) {
		ExampleWebSocketHandler.prototype[m] = ExampleWebSocketHandler_prototype[m]
	}



	function ChromeNodeWS() {
		// wrapper for WSC websocket impl
		this._listeners = {}


		var opts = {}
		opts.port = 26000
		opts.optAllInterfaces = true
		opts.optTryOtherPorts = false
		opts.optRetryInterfaces = false
		opts.handlers = []
		window.webapp = new WSC.WebApplication(opts)
		webapp.add_handler(['.*', ExampleWebSocketHandler.bind(null,this)])
		webapp.init_handlers()
		webapp.start( function(result) { console.log('webapp start result',result) } )
	}
	ChromeNodeWS.prototype = {
		trigger: function(evt,data) {
			var l = this._listeners[evt]
			if (l && l.length > 0) {
				l.forEach( function(cb) { cb(data) } )
			}
		},
		on: function(evt, cb) {
			//console.log('register',evt,cb)
			if (! this._listeners[evt])
				this._listeners[evt] = []
			this._listeners[evt].push(cb)
		}
	}

	window.ChromeNodeWS = ChromeNodeWS
})();
