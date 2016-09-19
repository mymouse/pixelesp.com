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

  	// editar o eliminar post en /cuenta
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