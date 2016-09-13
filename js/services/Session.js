app.service('Session', function () {

	if (window.localStorage.getItem('session') != null) {
		this.id = window.localStorage.getItem('session');

		userdata = JSON.parse(window.localStorage.getItem('userdata'));
		this.userRole = userdata.userlevel;
	}

	this.create = function (sessionId, userRole) {
		
		window.localStorage.setItem('session', sessionId);

		this.id = window.localStorage.getItem('session');
		this.userRole = userRole;
	};

	this.destroy = function () {
		this.id = null;
		this.userRole = null;
		window.localStorage.clear();
	};
})