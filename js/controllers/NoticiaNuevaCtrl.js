/**
 * Upload Noticias
 */
app.controller('NoticiaNuevaCtrl', function($scope, $http, Session, ngDialog, $location) {

	$scope.noticia={};
	$scope.noticia.Titulo='';
	$scope.noticia.Descripcion='';
	$scope.noticia.id ='';

	if (Session.id != null) {

		$scope.newPost = function() {

			userdata = JSON.parse(window.localStorage.getItem('userdata'));
			$scope.noticia.username = userdata.username; 
			$scope.noticia.idusuario = userdata.id;

			$http.post('http://pixelesp-api.herokuapp.com/noticias',$scope.noticia).then(function(resp) {
				//console.log(resp.data);
				//console.log('noticia publicada');

				ngDialog.closeAll();
				$location.path("/thread/"+resp.data.data.id);

			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
		};
	}
})