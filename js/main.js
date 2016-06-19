/**
 * Main AngularJS Web Application
 */

var app = angular.module('pixelespWebApp', ['ngRoute', 'ngDialog', 'angularMoment']);

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

app.service('Session', function () {
  this.create = function (sessionId/*, userId, userRole*/) {
    this.id = sessionId;/*
    this.userId = userId;
    this.userRole = userRole;*/

    window.localStorage.setItem("session", this.id);
    console.log('sesion creada con exito');
  };
  this.destroy = function () {
    this.id = null;/*
    this.userId = null;
    this.userRole = null;*/

    window.localStorage.clear();
    console.log('sesion clear');
  };
})

app.factory('AuthService', function ($http, Session) {
  var authService = {};
 
  authService.doLogin = function (usuario) {
    return $http
      .post('http://pixelesp-api.herokuapp.com/login', usuario)
      .then(function (resp) {

		Session.create(resp.data.token/*, resp.data.id, resp.data.userlevel*/);
       
        return resp.data;
      });
  };
 
  authService.isAuthenticated = function () {
    console.log('session id: '+!!Session.id);
    return !!Session.id;

  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userlevel) !== -1);
  };
 
  return authService;
})

/*app.factory('AuthResolver', function ($q, $rootScope, $state) {
  return {
    resolve: function () {
      var deferred = $q.defer();
      var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
        if (angular.isDefined(currentUser)) {
          if (currentUser) {
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
            $state.go('user-login');
          }
          unwatch();
        }
      });
      return deferred.promise;
    }
  };
})
*/
app.controller('ApplicationController', function ($scope, USER_ROLES, AuthService) {

  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = {};
   	$scope.currentUser.username = user.username;
  };
})



app.controller('SignupLogin', function($scope, $http, $rootScope, $location, $window, ngDialog, Session, AUTH_EVENTS, AuthService ) {

	$scope.usuario={};
	$scope.usuario.id ='';
	$scope.usuario.email='';
	$scope.usuario.username='';
	$scope.usuario.password='';
	
	$scope.doRegister = function() {
		$http.post('http://pixelesp-api.herokuapp.com/usuarios',$scope.usuario ).then(function(resp) {
			console.log(resp.data);
			console.log('registrado wachin');

		}, function(err) {
			console.error('ERR', err);
			console.log('you are crazy man');
			// err.status will contain the status code
		});
	};

	//$rootScope.userToken = ''; 

	$scope.doLogin = function(usuario) {

		AuthService.doLogin(usuario).then(function (user) {

			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

			$token = Session.id;
			console.log('asdsadas '+$token);

			$scope.user = {};
			$http.get('http://pixelesp-api.herokuapp.com/me', {headers: {'auth-token': $token}}).then(function(resp) {
				$scope.user = resp.data.data;

				//Session.create($token, resp.data.data.id, resp.data.data.userlevel);
				$scope.setCurrentUser($scope.user);

			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});

			

			ngDialog.closeAll();

			console.log('creo que se logeo.');
		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);

			console.log('no se logeo ni bosta.');
		});


	};
})

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		// Home
		.when("/", {
			templateUrl: "partials/home.html",
			controller: "PageCtrl" })
		// Pages
		.when("/comunidad", {
			templateUrl: "partials/comunidad.html",
			controller: "PageCtrl" })
		.when("/galeria", {
			templateUrl: "partials/galeria.html",
			controller: "PageCtrl" })
		.when("/contacto", {
			templateUrl: "partials/contacto.html",
			controller: "PageCtrl" })
		// Blog
		.when("/foro", {
			templateUrl: "partials/foro.html",
			controller: "BlogCtrl" })

		.when("/thread/:NoticiaId", {
			templateUrl: "partials/thread.html",
			controller: "NoticiaCtrl" })
		// else 404
		.otherwise("/404", {
			templateUrl: "partials/404.html",
			controller: "PageCtrl" });
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function ( $scope, $location, $http ) {
	//console.log("Blog Controller reporting for duty.");
});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ( $scope, $location, $http ) {
	//console.log("Page Controller reporting for duty.");

	// Activates the Carousel
	$('.carousel').carousel({
		interval: 5000
	}); 

});

/**
 * Navbar
 */
app.controller('NavCtrl', function ($scope, Session, ngDialog) {

	$scope.openLogin = function () {
		$scope.value = true;

		ngDialog.open({
			template: 'partials/singup.html',
			controller: 'SignupLogin',
			className: 'ngdialog-theme-plain',
			cache: false,
			scope: $scope
		});
	};

	$scope.doLogout = function() {
		Session.destroy;
		console.log('Estas fuera!');        
		
		//$location.path('#/profile');
	};
});

/**
* Sidebar Controller
*/
app.controller('sideBar', function($scope) {
	$scope.items = [
		{
			title: 'Inicio',
			icon: 'home',
			href: '#/'
		}, { 
			title: 'Galería',
			icon: 'picture-o',
			href: '#/galeria'
		}, { 
			title: 'Trabajo',
			icon: 'briefcase',
			href: '#/trabajo'
		}, { 
			title: 'Foro',
			icon: 'comments-o',
			href: '#/foro'
		}, { 
			title: 'Comunidad',
			icon: 'users',
			href: '#/comunidad'
		}, { 
			title: 'Contacto',
			icon: 'envelope-o',
			href: '#/contacto'
		}
	];
	$scope.selected = 0;

	$scope.select= function(index) {
		$scope.selected = index; 
	};
});

/**
 * Login & Registro
 */

app.controller('getUserInfo', function($scope, $rootScope, $http) {

	if (window.localStorage.getItem("session") != null) {

		$rootScope.isUserLogged = true;
		//Dirige a la pantalla principal ya logueada.
		console.log('ke once, estas en tu session');

		//get user data
		$token = window.localStorage.getItem("session");
		$scope.user = {};
		$http.get('http://pixelesp-api.herokuapp.com/me', {headers: {'auth-token': $token}}).then(function(resp) {
			$scope.user = resp.data.data;

		}, function(err) {
			console.error('ERR', err);
			// err.status will contain the status code
		});

	} else {
		$rootScope.isUserLogged = false;
		console.log('you are the real g, but your not into the session');
	}

})

/**
 * Get Noticias
 */
app.controller('NoticiaslistsCtrl', function($scope, $http) {
		
	$scope.noticias = [];
	$http.get('http://pixelesp-api.herokuapp.com/noticias').then(function(resp) {
		$scope.noticias = resp.data.data;
		//console.log('Succes', resp.data.data);
	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	});

});

/**
 * Show Noticias
 */
app.controller('NoticiaCtrl', function($scope, $routeParams, $http) {

  $scope.noticia = {};
  $http.get('http://pixelesp-api.herokuapp.com/noticias/'+ $routeParams.NoticiaId).then(function(resp) {
	$scope.noticia = resp.data.data;
	console.log('vevo');

  }, function(err) {
	console.error('ERR', err);
	// err.status will contain the status code
  });
})