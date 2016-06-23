/**
 * Main AngularJS Web Application
 */

var app = angular.module('pixelespWebApp', ['ngRoute', 'ngDialog', 'angularMoment', 'angularFileUpload']);

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
  admin: 1,
  editor: 2,
  guest: 3
})

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

app.controller('ApplicationController', function ($scope, USER_ROLES, AuthService) {

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

	$scope.doLogin = function(usuario) {

		AuthService.doLogin(usuario).then(function (user) {

			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

			$token = Session.id;
			$scope.user = {};
			$http.get('http://pixelesp-api.herokuapp.com/me', {headers: {'auth-token': $token}}).then(function(resp) {

				$scope.user = resp.data.data;
				$scope.setCurrentUser($scope.user, $scope.user.userlevel);

			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
			ngDialog.closeAll();

		}, function () {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);

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
    .when("/mi-perfil", {
        templateUrl: "partials/profile.html",
        controller: "PageCtrl" })		
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
}])

app.run( function($rootScope, $location, AuthService) {
	// register listener to watch route changes
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {

		if ( AuthService.isAuthenticated() == false ) {
			if ( next.templateUrl == "partials/profile.html" ) {
				$location.path("/");
			}
		}   

	});
}) 

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function ( $scope, $location, $http ) {
	//console.log("Blog Controller reporting for duty.");
})

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ( $scope, $location, $http ) {
	//console.log("Page Controller reporting for duty.");

	// Activates the Carousel
	$('.carousel').carousel({
		interval: 5000
	}); 

})

/**
 * Navbar
 */
app.controller('NavCtrl', function ($scope, Session, $window, ngDialog) {

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

	$scope.openCreatePost = function () {
		$scope.value = true;

		ngDialog.open({
			template: 'partials/createpost.html',
			controller: 'UploadController',
			className: 'ngdialog-theme-plain',
			width: '800px',
			cache: false,
			scope: $scope
		});
	};

	$scope.doLogout = function() {
			Session.destroy();
			$window.location.reload();
	};
})

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

})

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

/*
 * File Upload
 */
app.controller('UploadController', function($scope, FileUploader) {
	$scope.uploader = new FileUploader();
});