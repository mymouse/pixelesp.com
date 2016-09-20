/**
 * Main AngularJS Web Application
 */

var app = angular.module('pixelespWebApp', ['ui.router', 'ngDialog', 'ngMessages', 'angularMoment', 'cloudinary', 'ngFileUpload', 'ngImgCrop', '720kb.socialshare', 'ngParallax', 'angularGrid']);

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

function configure(CloudinaryProvider) {
	CloudinaryProvider.configure({
		cloud_name: 'hyktxhgfc', // your Cloud name
		api_key: '584471834239559' // your API Key
	});
}
app.config(['CloudinaryProvider', configure]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	//$locationProvider.html5Mode(true);

	userdata = JSON.parse(window.localStorage.getItem('userdata'));
	if ( !userdata ) {
		userdata = {};
		userdata.id = 1;
	}

	$urlRouterProvider.when('', '/');
	
	$urlRouterProvider.otherwise('/404');
	
	$stateProvider
		.state("home", {
			url: '/',
			templateUrl: "partials/home.html",
			controller: "" })

		// Pages
		.state("perfil", {
			url: '/usuario/:id_usuario',
			templateUrl: "partials/profile.html",
			controller: "perfilCtrl" })

		.state("cuenta", {
			url: '/cuenta/',
			templateUrl: "partials/account.html",
			controller: "perfilCtrl",
			params: {
				id_usuario: userdata.id
			} })

		.state("comunidad", {
			url: '/comunidad',
			templateUrl: "partials/comunidad.html",
			controller: "" })
		.state("galeria", {
			url: '/galeria',
			templateUrl: "partials/galeria.html",
			controller: "" })
		.state("contacto", {
			url: '/contacto',
			templateUrl: "partials/contacto.html",
			controller: "" })
		.state("trabajo", {
			url: '/empleo',
			templateUrl: "partials/empleos.html",
			controller: "" })

		.state("encola", {
			url: '/en-cola',
			templateUrl: "partials/encola.html",
			controller: "getPostsToApprobal" })

		// Noticias
		.state("home.thread", {

			url: 'post/:NoticiaId',
			/*templateUrl: 'partials/thread.html',
			controller: 'noticiaCtrl'*/

			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.open({
					controller: 'noticiaCtrl',
					templateUrl: 'partials/thread.html',
					className: 'ngdialog-theme-thread animated fadeIn'

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		// Pixelarts en Home
		.state("home.pixelart", {

			url: 'pixelart/:pixelartId',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.open({
					controller: 'pixelartCtrl',
					templateUrl: 'partials/pixelart.html',
					className: 'ngdialog-theme-thread animated fadeIn'

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		// Crear pixelart
		.state("home.createpost", {

			url: 'subir-pixelart',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.close();
				ngDialog.open({
					template: 'partials/createpost.html',
					controller: 'newPost',
					className: 'ngdialog-theme-plain width-post',
					cache: false,
					closeByEscape: false,
					closeByDocument: false,
					showClose: false

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})		

		// posts
		.state("home.createnews", {

			url: 'crear-post',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.close();
				ngDialog.open({
					template: 'partials/createnews.html',
					controller: 'noticiaNueva',
					className: 'ngdialog-theme-plain width-noticia',
					cache: false,
					closeByEscape: false,
					closeByDocument: false,
					showClose: false

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		// Pixelarts en galeria
		.state("galeria.pixelart", {

			url: '/pixelart/:pixelartId',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.open({
					controller: 'pixelartCtrl',
					templateUrl: 'partials/pixelart.html',
					className: 'ngdialog-theme-thread animated fadeIn'

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		// Crear pixelart
		.state("galeria.createpost", {

			url: '/subir-pixelart',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.close();
				ngDialog.open({
					template: 'partials/createpost.html',
					controller: 'newPost',
					className: 'ngdialog-theme-plain width-post',
					cache: false,
					closeByEscape: false,
					closeByDocument: false,
					showClose: false

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		// Pixelarts en cola
		.state("encola.pixelart-to-approbal", {

			url: '/:pixelartId',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.open({
					controller: 'pixelartCtrl',
					templateUrl: 'partials/pixelart-en-cola.html',
					className: 'ngdialog-theme-plain width-noticia animated fadeIn'

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})
		
		.state("trabajo.empleo", {

			url: '/:TrabajoId',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.open({
					controller: 'trabajoCtrl',
					templateUrl: 'partials/thread.html',
					className: 'ngdialog-theme-thread animated fadeIn'

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		.state("trabajo.createjobs", {

			url: '/crear-empleo',
			onEnter: ['ngDialog', '$state', 'Session', function(ngDialog, $state, Session) {

				ngDialog.close();
				ngDialog.open({
					template: 'partials/createjobs.html',
					controller: 'TrabajoNuevoCtrl',
					className: 'ngdialog-theme-plain width-noticia',
					cache: false,
					closeByEscape: false

				}).closePromise.finally(function() {
					$state.go('^');
				});
			}]
		})

		// Blog
		.state("app", {
			url: '/app',
			templateUrl: "partials/app.html",
			controller: "" })
		// 404
		.state("404", {
			url: '/404',
			templateUrl: "partials/404.html",
			controller: "" })
});

app.run( function($rootScope, $state, $location, AuthService) {

	// register listener to watch route changes
	$rootScope.$on( "$stateChangeStart", function(event, next, current) {

		//console.log('estoy en: '+$state.current.name);

		// si no esta logeado
		if ( AuthService.isAuthenticated() == false ) {
			// si quiere entrar a /mi-perfil
			if ( next.templateUrl == "partials/account.html" ) {
				$location.path("/");
			}
		}

		// si no esta logeado o si no es admin
		if ( AuthService.isAuthenticated() == false || AuthService.isAuthorized() == false ) {
			// si quiere entrar a /en-cola
			if ( next.templateUrl == "partials/encola.html" ) {
				$location.path("/");
			}
		}

	});
});