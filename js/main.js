/**
 * Main AngularJS Web Application
 */

var app = angular.module('pixelespWebApp', ['ui.router', 'ngAnimate', 'ngDialog', 'ngMessages', 'angularMoment', 'angularFileUpload', 'ngFormFixes']);

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

app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('', '/');
    
    $urlRouterProvider.otherwise('/404');
    
    $stateProvider
        .state("home", {
        	url: '/',
			templateUrl: "partials/home.html",
			controller: "PageCtrl" })
		// Pages
		.state("mi-perfil", {
			url: '/mi-perfil',
			templateUrl: "partials/profile.html",
			controller: "PageCtrl" })
		.state("comunidad", {
			url: '/comunidad',
			templateUrl: "partials/comunidad.html",
			controller: "PageCtrl" })
		.state("galeria", {
			url: '/galeria',
			templateUrl: "partials/galeria.html",
			controller: "PageCtrl" })
		.state("contacto", {
			url: '/contacto',
			templateUrl: "partials/contacto.html",
			controller: "PageCtrl" })

		// Posts
		.state("home.thread", {

			url: 'thread/:NoticiaId',
			/*templateUrl: 'partials/thread.html',
			controller: 'NoticiaCtrl'*/

			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

		        ngDialog.open({
					controller: "NoticiaCtrl",
					templateUrl: 'partials/thread.html',
					className: 'ngdialog-theme-tread'

		        }).closePromise.finally(function() {
		            $state.go('^');
		        });
		    }]			
		})

		// Blog
		.state("foro", {
			url: '/foro',
			templateUrl: "partials/foro.html",
			controller: "BlogCtrl" })
		// 404
		.state("404", {
			url: '/404',
			templateUrl: "partials/404.html",
			controller: "BlogCtrl" })
});

app.run( function($rootScope, $location, AuthService) {
	// register listener to watch route changes
	$rootScope.$on( "$stateChangeStart", function(event, next, current) {

		if ( AuthService.isAuthenticated() == false ) {
			if ( next.templateUrl == "partials/profile.html" ) {
				$location.path("/");
			}
		}
	});
}) 

/**/

/**
 * Configure the Routes
 
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

	/*.when("/thread/:NoticiaId", {
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

*/


