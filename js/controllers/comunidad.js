/**
 * Get All Usuarios
 */
app.controller('getUsiarios', function($scope, $http) {

	$scope.fundo = "./img/fundo4.jpg";

	$scope.usuarios = [];
	$http.get('http://pixelesp-api.herokuapp.com/usuarios').then(function(resp) {
		$scope.usuarios = resp.data.data;

        //apply search and sort method
		var usuarios = $scope.usuarios
		$scope.usuarios = usuarios.concat([]);
        $scope.searchUser = "";

        $scope.$watch('searchUser', function (val) {

            val = val.toLowerCase();
            $scope.usuarios = usuarios.filter(function (obj) {
                return obj.username.toLowerCase().indexOf(val) != -1;
            });
        });

	}, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	});
})


/**
 * Get/Show individual Usuario and content
 */
app.controller('perfilCtrl', function($scope, $state, $stateParams, $http, ngDialog, Session, Upload, Cloudinary) {

	$scope.usuario = {};
	userdata = JSON.parse(window.localStorage.getItem('userdata'));
	//$stateParams.id_usuario = userdata.id;

	$http.get('http://pixelesp-api.herokuapp.com/usuarios/'+ $stateParams.id_usuario).then(function(resp) {
		$scope.usuario = resp.data.data;
		//console.log($scope.usuario)

	}, function(err) {
		//console.error('ERR', err);
	});

	$scope.SendMP = function() {

		ngDialog.open({
			templateUrl: 'partials/chat.html',
			controller: 'sendMP',
			className: 'ngdialog-theme-plain chat',
			cache: false,
			showClose: false
		})
	}

  	// Actualizar perfil
  	if (Session.id != null) {

	  	userdata = JSON.parse(window.localStorage.getItem('userdata'));
	  	$scope.usuario = {};
	  	$scope.usuario.id = userdata.id;

	  	$scope.doSave = function(file, avatarCrop, avatarFromPC) {

	      	$scope.doSaveData = function(avatar) {

		    	if (avatar) {
		            $scope.usuario.imagen = avatar;
		            
		            /*$token = Session.id;
					$scope.user = {};
					$http.get('http://pixelesp-api.herokuapp.com/me', {headers: {'auth-token': $token}}).then(function(resp) {

						$scope.user = resp.data.data;
						$scope.setCurrentUser($scope.user);
					});*/

		    	} else {	    		
		            $scope.usuario.imagen = $scope.usuario.imagen;
		            console.log('NO hay avatar: '+$scope.usuario.imagen)
		    	}

		    	if ($scope.usuario.newpassword) {	    		
		    		$scope.usuario.password = $scope.usuario.newpassword;
		    	}

				$http.put('http://pixelesp-api.herokuapp.com/usuarios/'+ $stateParams.id_usuario, $scope.usuario).then(function(resp) {

					userdata = resp.data.data;
					window.localStorage.setItem('userdata', JSON.stringify(userdata));
					$scope.currentUser = {};
					$scope.currentUser = userdata;

					ngDialog.close();
					ngDialog.open({
						templateUrl: 'partials/messages.html',
						className: 'ngdialog-theme-plain card-message',
						cache: false,
						showClose: false,
						data: {
							class: 'card-inverse card-success',
							text: 'Perfil actualizado',
							footertext: 'Sigue creando!',
							time: 2
						},
						preCloseCallback: function(){
							$state.go('cuenta', { id_usuario: resp.data.id }, { reload: true });
						}
					})


				}, function(err) {
					//console.error('ERR', err);
					$scope.pixelarterror = err.data.msg;
					//console.log('ke lo ke: '+$scope.pixelarterror);
				}); //end http post
			}

	  		if (avatarFromPC) {
		        avatarFromPC.upload = Upload.upload({
		          url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
		          data: {
		            upload_preset: 'c5o7wpot',
		            folder: 'Avatar',
		            username: userdata.username,
		            file: avatarFromPC
		          },
		        }).then(function (resp) {
		            //console.log('Success avatarFromPC ' + resp.config.data.file.name + 'uploaded. Response: ' + JSON.stringify(resp.data));
		            var urlAvatarPC = resp.data.url;
		            avatar = urlAvatarPC.substr(urlAvatarPC.lastIndexOf('d/') + 2);
					$scope.doSaveData(avatar);

		        }, function (resp) {
		            console.log('Error status: ' + resp.status);
		        }, function (evt) {
		            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		        });

		    } else if (!avatarFromPC && file) {
		        avatarCrop.upload = Upload.upload({
		          url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
		          data: {
		            upload_preset: 'c5o7wpot',
		            folder: 'Avatar',
		            username: userdata.username,
		            file: Upload.dataUrltoBlob(avatarCrop, file.name),
		            origFile: file
		          },
		        }).then(function (resp) {
		            console.log('Success avatarCrop ' + resp.config.data.file.name + 'uploaded. Response: ' + JSON.stringify(resp.data));
		            var urlAvatar = resp.data.url;
		            avatar = urlAvatar.substr(urlAvatar.lastIndexOf('d/') + 2);
					$scope.doSaveData(avatar);

		        }, function (resp) {
		            console.log('Error status: ' + resp.status);
		        }, function (evt) {
		            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		        });
		    } else {
		    	$scope.doSaveData();
		    }
	    }
	}
})

/*
 * Send MP
 */
app.controller('sendMP', function ($scope, $stateParams, $http, Session, ngDialog) {

	$scope.mensaje = {};
	$scope.mensaje.asunto = '';
	$scope.mensaje.mensaje = '';

	$scope.usuario = {};

	userdata = JSON.parse(window.localStorage.getItem('userdata'));
	$scope.currentUser = userdata;
	$scope.mensaje.id_origen = userdata.id;

	// Get

	$http.get('http://pixelesp-api.herokuapp.com/listarmensajes/' + $stateParams.id_usuario).then(function (resp) {
         
		$scope.mensajes = resp.data.data;
		console.log($scope.mensajes);

	}, function (err) {
		console.error('ERR', err);
	});

	// Enviar
	if (Session.id != null) {

		$scope.doSend = function () {

			$http.post('http://pixelesp-api.herokuapp.com/crearmensaje/' + $stateParams.id_usuario, $scope.mensaje).then(function (resp) {

				console.log('Creado');

				ngDialog.close();
				ngDialog.open({
					templateUrl: 'partials/messages.html',
					className: 'ngdialog-theme-plain card-message',
					cache: false,
					showClose: false,
					data: {
						class: 'card-inverse card-success',
						text: 'Mensaje Enviado!',
						footertext: 'Sigue haciendo amigos!',
						time: 3
					},
					preCloseCallback: function(){
						$state.go('perfil', { id_usuario: resp.data.id }, { reload: true });
					}
				})

			}, function (err) {
				console.error('ERR', err);
			});
		}

	}

})


.controller('MensajesCtrl', function ($scope, $http, $stateParams, $rootScope) {

    
  
$scope.mensajes = [];
  $scope.$on('$ionicView.beforeEnter', function () {
        
   
 });

   

})
.controller('MensajeCtrl', function ($scope, $state, $stateParams, $http, $location, $ionicPopup, $ionicLoading, $ionicHistory) {

    $scope.mensaje = {};

    $scope.$on('$ionicView.beforeEnter', function () {
        $http.get('http://pixelesp-api.herokuapp.com/mensaje/' + $stateParams.IdMensaje).then(function (resp) {

            //Saco el icono de Cargando.
            $ionicLoading.hide();

            $scope.mensaje = resp.data.data[0];

            console.log($scope.mensaje);

        }, function (err) {

            //Saco el icono de Cargando.
            $ionicLoading.hide();

            console.error('ERR', err);
            // err.status will contain the status code
        });
    });

    $scope.doBorrar = function () {

        console.log('Borrado!');

        $http.delete('http://pixelesp-api.herokuapp.com/borrarmensaje/' + $stateParams.IdMensaje).then(function (resp) {

           
          
                $ionicHistory.goBack();
                
           

        }, function (err) {

            console.error('ERR', err);
            // err.status will contain the status code

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: err.data.msg
            });

            alertPopup.then(function (res) { });

        });
    };
});