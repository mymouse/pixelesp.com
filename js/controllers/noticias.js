/**
 * Get All Noticias
 */
app.controller('getNoticias', function($scope, $http) {

	$('.main-sidebar').removeClass('opened');

	$scope.loading = true;
	$scope.noticias = [];
	$http.get('http://pixelesp-api.herokuapp.com/noticias').then(function(resp) {
		$scope.noticias = resp.data.data;
		//console.log('Succes', resp.data.data);

	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	})['finally'](function() {
    	$scope.loading = false;
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
				$scope.comment.text = '' ;
				$scope.noticia.comentarios.push(resp.data.data);


			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
		}
	}

	$scope.doDeleteComment = function($id) {

		$http.delete('http://pixelesp-api.herokuapp.com/newscomments/'+ $id).then(function(resp) {
			console.log(resp.data);

			$('#'+$id).fadeOut();

		}, function(err) {
			console.error('ERR', err);
		});
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
		$http.put('http://pixelesp-api.herokuapp.com/noticias/'+ $stateParams.NoticiaId, $scope.noticia).then(function(resp) {
			console.log(resp.data);  
			$location.path('/app/noticias');

		}, function(err) {
			console.error('ERR', err);
			// err.status will contain the status code
		});
	};

  	$scope.doDelete = function() {
	  	$http.delete('http://pixelesp-api.herokuapp.com/noticias/'+ $stateParams.NoticiaId, $scope.noticia).then(function(resp) {
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
					preCloseCallback: function(){  $state.go('home', {}, { reload: true }); } 
				});

	    }, function(err) {
	      console.error('ERR', err);
	      // err.status will contain the status code
	    });
  	}
  
})

/**
 * Create/Upload Noticias
 */
app.controller('noticiaNueva', function($scope, $http, Session, ngDialog, $state) {

	$scope.noticia = {};
	$scope.noticia.Titulo = '';
	$scope.noticia.Descripcion = '';
	$scope.noticia.id = '';

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

				ngDialog.open({
					templateUrl: 'partials/messages.html',
					className: 'ngdialog-theme-plain card-message',
					cache: false,
					showClose: false,
					data: {
						class: 'card-inverse card-success',
						text: 'Noticia creada',
						footertext: 'Muchas gracias!',
						time: 2
					},
					preCloseCallback: function(){
						$state.go('home.thread', { 'NoticiaId': resp.data.data.id }, { reload: true });
					}
       			})

			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			});
		};
	}
})