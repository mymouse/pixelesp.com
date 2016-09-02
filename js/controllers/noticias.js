/**
 * Get All Noticias
 */
app.controller('getNoticias', function($scope, $http, ngDialog) {

	$scope.noticias = [];
	$http.get('http://pixelesp-api.herokuapp.com/noticias').then(function(resp) {
		$scope.noticias = resp.data.data;
		//console.log('Succes', resp.data.data);

	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	});
})

/**
 * Get/Show individual Noticia and Comments
 */
app.controller('noticiaCtrl', function($scope, $state, $stateParams, $http, ngDialog, Session) {

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
				//console.log(resp);

				$('#commentinput').val('');
				$scope.noticia.comentarios.push(resp.data.data);


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

/**
 * Create/Upload Noticias
 */
app.controller('noticiaNueva', function($scope, $http, Session, ngDialog, $location) {

	$scope.noticia={};
	$scope.noticia.Titulo='';
	$scope.noticia.Descripcion='';
	$scope.noticia.id ='';

	if (Session.id != null) {

		$scope.newNoticia = function() {

			userdata = JSON.parse(window.localStorage.getItem('userdata'));
			$scope.noticia.username = userdata.username; 
			$scope.noticia.idusuario = userdata.id;
			$scope.noticia.imagen = userdata.imagen;

			$http.post('http://pixelesp-api.herokuapp.com/noticias',$scope.noticia).then(function(resp) {
				console.log(resp.data);
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