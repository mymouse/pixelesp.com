/**
 * Get Noticias
 */
app.controller('NoticiaslistsCtrl', function($scope, $http, ngDialog) {

	$scope.noticias = [];
	$http.get('http://pixelesp-api.herokuapp.com/noticias').then(function(resp) {
		$scope.noticias = resp.data.data;
		//console.log('Succes', resp.data.data);

	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	});
})