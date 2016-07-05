/**
 * Get Noticias
 */
app.controller('NoticiaslistsCtrl', function($scope, $http, ngDialog) {
		
	$scope.noticias = [];
	$http.get('http://pixelesp-api.herokuapp.com/noticias').then(function(resp) {
		$scope.noticias = resp.data.data;
		//console.log('Succes', resp.data.data);

		$scope.comentarios = [];
		angular.forEach($scope.noticias, function(noticia) {
			angular.forEach(noticia.comentarios, function(comentario) {
				$scope.comentarios.push(comentario)
			})
		})

		$scope.openPost = function (_noticia) {

			var modalInstance = ngDialog.open({
				controller: "ModalNoticia",
				templateUrl: 'partials/thread.html',
				className: 'ngdialog-theme-tread',
				resolve: {
					noticia: function() {
						return _noticia;
					}
				}
			});
		};

	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	});	
})
