app.factory('AuthService', function ($rootScope, $http, Session) {
	var authService = {};
 
	authService.doLogin = function (usuario) {
		return $http
			.post('http://pixelesp-api.herokuapp.com/login', usuario)
			.then(function (resp) {
				console.log(resp.data);
				Session.create(resp.data.token, resp.data.userlevel);       
				return resp.data;

			}, function(err) {
				console.error('ERR', err);
				$rootScope.loginerror = err.data.msg;
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