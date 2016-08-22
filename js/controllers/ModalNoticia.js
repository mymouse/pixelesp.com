
app.controller('ModalNoticia', function ($scope, noticia, $http, Session, ngDialog) {
	$scope.noticia = noticia;	
})

/**
 * Show Noticias
 */
app.controller('NoticiaCtrl', function($scope, $stateParams, $http, ngDialog, Session) {

  $scope.noticia = {};
  $http.get('http://pixelesp-api.herokuapp.com/noticias/'+ $stateParams.NoticiaId).then(function(resp) {
    $scope.noticia = resp.data.data;

	/* ===== 
		===== 
		  ===== */

	userdata = JSON.parse(window.localStorage.getItem('userdata'));
	$scope.currentUser = userdata;

    $scope.guardarComentario = function(comment, ngDialogProvider) {

		if (Session.id != null) {

			$scope.comment = {};
			$scope.comment.text = comment.text;
			$scope.comment.idusuario = userdata.id;
			$scope.comment.id_noticia = $scope.noticia.id;
			$scope.comment.username = userdata.username;
			$scope.comment.imagen = userdata.imagen;

			$http.post('http://pixelesp-api.herokuapp.com/newscomments', $scope.comment).then(function(resp) {
				console.log('Comentario enviado: '+resp.data);

			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
		}
	}
	
	/*	  ===== 
		===== 
	  ===== */

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });
  
})