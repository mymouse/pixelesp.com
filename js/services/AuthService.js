app.factory('AuthService', function ($http, Session) {
	var authService = {};
 
	authService.doLogin = function (usuario) {
		return $http
			.post('http://pixelesp-api.herokuapp.com/login', usuario)
			.then(function (resp) {
				Session.create(resp.data.token, null);       
				return resp.data;
			});
	};
 
	authService.isAuthenticated = function () {
		console.log('session: '+!!Session.id);
		return !!Session.id;

	};
 
	authService.isAuthorized = function (authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.userRole) !== -1);
	};
 
	return authService;
})