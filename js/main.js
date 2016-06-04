/**
 * Main AngularJS Web Application
 */

var app = angular.module('pixelespWebApp', [
  'ngRoute', 'ngDialog', 'angularMoment'
]);

/**
 * Login Popup
 */
app.controller('MainCtrl', function ($scope, $rootScope, ngDialog, $timeout) {

  $scope.openTemplate = function () {
    $scope.value = true;

    ngDialog.open({
      template: 'partials/login.html',
      className: 'ngdialog-theme-plain',
      scope: $scope
    });
  }
});

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
    .when("/thread:postid", {
      templateUrl: "partials/thread.html",
      controller: "BlogCtrl" })
    // else 404
    .otherwise("/404", {
      templateUrl: "partials/404.html",
      controller: "PageCtrl" });
}]);

/**
* Navbar active item
*/
app.controller('selectItem', function($scope) {
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
 * Controls the Blog
 */
app.controller('BlogCtrl', function ( $scope, $location, $http ) {
  console.log("Blog Controller reporting for duty.");
});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ( $scope, $location, $http ) {
  console.log("Page Controller reporting for duty.");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  
});

/**
 * Get Noticias
 */
app.controller('NoticiaslistsCtrl', function($rootScope, $scope, $http, $location) {
    
  $scope.noticias = [];
  $http.get('http://pixelesp-api.herokuapp.com/noticias').then(function(resp) {
    $scope.noticias = resp.data.data;
    //console.log('Succes', resp.data.data);
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });

});