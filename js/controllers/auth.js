app.controller('auth', ['$scope', '$http', '$rootScope', '$location', '$window', 'ngDialog', 'Session', 'AUTH_EVENTS', 'AuthService', function($scope, $http, $rootScope, $location, $window, ngDialog, Session, AUTH_EVENTS, AuthService ) {

	$scope.usuario = {};
	$scope.usuario.id ='';
	$scope.usuario.email = '';
	$scope.usuario.username = '';
	$scope.usuario.password = '';
	
	$scope.doRegister = function() {



		$http.post('http://pixelesp-api.herokuapp.com/usuarios', $scope.usuario).then(function(resp) {
			//console.log(resp.data);
			//console.log('registrado wachin');

			$('#modalTabs li a:first').addClass('active');
			$('.tab-content #login').addClass('active in');

			$('#modalTabs li a:last').removeClass('active');
			$('.tab-content #singup').removeClass('active in');

			$scope.successRegister = 'Muy bien! ahora puedes ingresar.';


		}, function(err) {
			//console.error('ERR', err);
			$scope.singuperror = err.data.msg;
		});
	};

	$scope.doLogin = function(usuario) {

		AuthService.doLogin(usuario).then(function (user) {

			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

			$token = Session.id;
			$scope.user = {};
			$http.get('http://pixelesp-api.herokuapp.com/me', {headers: {'auth-token': $token}}).then(function(resp) {

				$scope.user = resp.data.data;
				$scope.setCurrentUser($scope.user, $scope.user.userlevel);
				
				ngDialog.close();


			}, function(err) {
				//console.error('ERR', err);
				$scope.thisloginerror = $scope.loginerror;
				console.log( "$scope.loginerror "+$scope.thisloginerror);
			});

		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);

		});

	};
}])