/**
 * Get All Trabajo
 */
app.controller('getTrabajos', function($scope, $http) {

	$scope.trabajos = [];
	$http.get('http://pixelesp-api.herokuapp.com/trabajos').then(function(resp) {
		$scope.trabajos = resp.data.data;

	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	});
})
	
/**
 * Create/Upload Trabajo
 */
app.controller('TrabajoNuevoCtrl', function($scope, $http, Session, ngDialog, $state) {
						
	$scope.trabajo = {};
	$scope.trabajo.Titulo = '';
	$scope.trabajo.Descripcion = '';
	$scope.trabajo.id = ''; 
	
	if (Session.id != null) {
		
		$scope.doRegister = function() {

			userdata = JSON.parse(window.localStorage.getItem('userdata'));
			$scope.trabajo.username = userdata.username; 
			$scope.trabajo.idusuario = userdata.id;
			$scope.trabajo.imagen = userdata.imagen;

			$http.post('http://pixelesp-api.herokuapp.com/trabajos', $scope.trabajo).then(function(resp) {
				console.log(resp.data);

				ngDialog.closeAll();
				ngDialog.open({
					templateUrl: 'partials/messages.html',
					className: 'ngdialog-theme-plain card-message',
					cache: false,
					showClose: false,
					data: {
						class: 'card-inverse card-success',
						text: 'Trabajo publicado',
						footertext: 'Muchas gracias!',
						time: 2
					},
					preCloseCallback: function(){
						$state.go('trabajo.empleo', { 'TrabajoId': resp.data.data.id }, { reload: true });
					}
				})


			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
		}
	}
});

/**
 * Get/Show individual trabajo and Comments
 */
app.controller('trabajoCtrl', function($scope, $state, $stateParams, $http, ngDialog, Session) {

  $scope.noticia = {};
  $http.get('http://pixelesp-api.herokuapp.com/trabajos/'+ $stateParams.TrabajoId).then(function(resp) {
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
			$scope.comment.id_empleo = $scope.trabajo.id;
			$scope.comment.username = userdata.username;
			$scope.comment.imagen = userdata.imagen;

			$http.post('http://pixelesp-api.herokuapp.com/empleocomments', $scope.comment).then(function(resp) {
				//console.log(resp);

				$('#commentinput').val('');
				$scope.comment.text = '' ;
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

  // editar o eliminar post
	$scope.doSave = function() {
		$http.put('http://pixelesp-api.herokuapp.com/trabajos/'+ $stateParams.TrabajoId, $scope.trabajo).then(function(resp) {
			console.log(resp.data);  
			$location.path('/app/trabajos');

		}, function(err) {
			console.error('ERR', err);
			// err.status will contain the status code
		});
	};

  	$scope.doDelete = function() {
	  	$http.delete('http://pixelesp-api.herokuapp.com/trabajos/'+ $stateParams.TrabajoId, $scope.trabajo).then(function(resp) {
	      console.log(resp.data);	     

	      ngDialog.close();
				ngDialog.open({
					templateUrl: 'partials/messages.html',
					className: 'ngdialog-theme-plain card-message',
					showClose: false,
					data: {
						class: 'card-inverse card-success',
						text: 'Post Eliminado',
						footertext: 'podés crear otro!',
						time: 3
					},
					preCloseCallback: function(){  $state.go('trabajo', {}, { reload: true }); } 
				});

	    }, function(err) {
	      console.error('ERR', err);
	      // err.status will contain the status code
	    });
  	}
  
})