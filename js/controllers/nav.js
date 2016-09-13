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

	$scope.doLogout = function() {
		Session.destroy();
		$window.location.reload();
	};
})