
app.controller('ModalNoticia', function ($scope, noticia, $http, Session, ngDialog) {
	$scope.noticia = noticia;

	$scope.guardarComentario = function(comment) {

		if (Session.id != null) {

			userdata = JSON.parse(window.localStorage.getItem('userdata'));
			$scope.comment = {};
			$scope.comment.text = comment.text;
			$scope.comment.idusuario = userdata.id;
			$scope.comment.id_noticia = $scope.noticia.id;
			$scope.comment.username = userdata.username;

			$http.post('http://pixelesp-api.herokuapp.com/newscomments', $scope.comment).then(function(resp) {
				console.log(resp.data);
				ngDialog.setForceBodyReload(true);					

			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
		}
	}
})