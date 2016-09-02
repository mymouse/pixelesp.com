/**
 * Navbar
 */
app.controller('NavCtrl', function ($scope, Session, $window, ngDialog) {

	$scope.openLogin = function () {
		$scope.value = true;

		ngDialog.open({
			template: 'partials/singup.html',
			controller: 'auth',
			className: 'ngdialog-theme-plain',
			cache: false,
			scope: $scope
		});
	};

	$scope.openCreatePost = function () {
		$scope.value = true;

		ngDialog.open({
			template: 'partials/createpost.html',
			controller: 'newPost',
			className: 'ngdialog-theme-plain width-post',
			cache: false,
			scope: $scope

		});
	};

	$scope.openCreateNews = function () {
		$scope.value = true;

		ngDialog.open({
			template: 'partials/createnews.html',
			controller: 'noticiaNueva',
			className: 'ngdialog-theme-plain width-noticia',
			cache: false,
			scope: $scope,
			width: 800			
		});
	};

	$scope.doLogout = function() {
		Session.destroy();
		$window.location.reload();
	};
})