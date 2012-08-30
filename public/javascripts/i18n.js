// Labels and messages
function Messages() {
	var keys = {
		hello : "Hello"
	};

	this.get = function(key, args) {
		var msg = this.keys[key];
		if (!msg) {
			msg = "!!! " + key +" !!!";
		}

		// check args
		if (args) {
			// TODO handle arg
		}

		return msg;
	};
}

var msg = new Messages();