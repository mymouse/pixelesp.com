app.service('Session', function () {

	if (window.localStorage.getItem('session') != null) {
		this.id = window.localStorage.getItem('session');

		userdata = JSON.parse(window.localStorage.getItem('userdata'));
		this.userRole = userdata.userlevel;
	}

	this.create = function (sessionId, userRole) {
		window.localStorage.setItem('session', sessionId);
<<<<<<< HEAD
		this.id = window.localStorage.getItem('session');
=======
	this.id = window.localStorage.getItem('session');
>>>>>>> origin/master
		this.userRole = userRole;
	};

	this.destroy = function () {
		this.id = null;
		this.userRole = null;
		window.localStorage.clear();
	};
})