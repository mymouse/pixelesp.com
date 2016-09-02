app.controller('webApp', function ($scope, USER_ROLES, AuthService, $location) {

	if (window.localStorage.getItem('session') != null) {

		userdata = JSON.parse(window.localStorage.getItem('userdata'));
		$scope.currentUser = {};
		$scope.currentUser = userdata;

		$scope.userRoles = USER_ROLES;
		$scope.isAuthorized = AuthService.isAuthorized;
	}
 
	$scope.setCurrentUser = function (user) {

		window.localStorage.setItem('userdata', JSON.stringify(user));
		$scope.currentUser = {};
		$scope.currentUser = user;
	}

	$scope.go = function ( path ) {
	  $location.path( path );
	};

})