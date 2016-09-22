/**
 * Get Posts NO Aprobados
 */
app.controller('getPostsToApprobal', function($scope, $http, ngDialog) {

  $scope.imagenes = [];
  $http.get('http://pixelesp-api.herokuapp.com/imagenessinaprobar').then(function(resp) {
    $scope.imagenes = resp.data.data;
    //console.log('Succes', resp.data.data);

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });
})

/**
 * Get Posts Aprobados
 */
app.controller('getPosts', function($scope, $http, ngDialog) {

  $scope.loading_pixelarts = true;
  $scope.imagenes = [];
  $http.get('http://pixelesp-api.herokuapp.com/imagenes').then(function(resp) {
    $scope.imagenes = resp.data.data;
    //console.log('Succes', resp.data.data);

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })['finally'](function() {
      $scope.loading_pixelarts = false;
  });

  //get length favortios
  $scope.favs = [];
  $http.get('http://pixelesp-api.herokuapp.com/favimg').then(function(resp) {
    $scope.favs = resp.data.data;
    //console.log('Succes', resp.data.data);
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });

  //get length usuarios
  $scope.users = [];
  $http.get('http://pixelesp-api.herokuapp.com/usuarios').then(function(resp) {
    $scope.users = resp.data.data;
    //console.log('Succes', resp.data.data);
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });

})

/*
 * Upload pixelArt
 */
app.controller('newPost', function ($scope, $http, $state, Upload, Session, $timeout, Cloudinary, ngDialog) {

  $scope.imagen = {};
  $scope.imagen.id = '';
  $scope.imagen.Aprobada = '1';
  $scope.imagen.Titulo = '';
  $scope.imagen.Descripcion = '';
  $scope.imagen.Tags = '';
  $scope.imagen.Imagen = '';
  $scope.imagen.Previa = '';

  if (Session.id != null) {

    $scope.uploadPic = function(file, previaCrop, previaFromPC) {

      userdata = JSON.parse(window.localStorage.getItem('userdata'));
      $scope.imagen.idusuario = userdata.id;

      if (previaFromPC) {
        previaFromPC.upload = Upload.upload({
          url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
          data: {
            upload_preset: 'c5o7wpot',
            tags: $scope.imagen.Tags,
            folder: 'Previa',
            username: userdata.username,
            file: previaFromPC
          },
        }).then(function (resp) {
            //console.log('Success previaFromPC ' + resp.config.data.file.name + 'uploaded. Response: ' + JSON.stringify(resp.data));
            var urlPreviaPC = resp.data.url;
            $scope.imagen.Previa = '';
            $scope.imagen.Previa = urlPreviaPC.substr(urlPreviaPC.lastIndexOf('d/') + 2);

        }, function (resp) {
            //console.log('Error status: ' + resp.status);
        }, function (evt) {
            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

      } else {
        previaCrop.upload = Upload.upload({
          url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
          data: {
            upload_preset: 'c5o7wpot',
            tags: $scope.imagen.Tags,
            folder: 'Previa',
            username: userdata.username,
            file: Upload.dataUrltoBlob(previaCrop, file.name),
            origFile: file
          },
        }).then(function (resp) {
            //console.log('Success previaCrop ' + resp.config.data.file.name + 'uploaded. Response: ' + JSON.stringify(resp.data));
            var urlPrevia = resp.data.url;
            $scope.imagen.Previa = urlPrevia.substr(urlPrevia.lastIndexOf('d/') + 2);

        }, function (resp) {
            //console.log('Error status: ' + resp.status);
        }, function (evt) {
            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      } //end if (!previaFromPC)

      file.upload = Upload.upload({
        url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
        data: {
          upload_preset: 'c5o7wpot',
          tags: $scope.imagen.Tags,
          username: userdata.username,
          file: file
        },
      });
      
      file.upload.then(function (response) {
        $timeout(function () {

          var url = response.data.url;
          $scope.imagen.Imagen = url.substr(url.lastIndexOf('d/') + 2);

          $http.post('http://pixelesp-api.herokuapp.com/imagenes', $scope.imagen).then(function(resp) {
            
            ngDialog.close();
            ngDialog.open({
              templateUrl: 'partials/messages.html',
              className: 'ngdialog-theme-plain card-message',
              cache: false,
              showClose: false,
              data: {
                class: 'card-inverse card-success',
                text: 'PixelArt creado',
                footertext: 'Sigue creando!',
                time: 2
              },
              preCloseCallback: function(){
                if ($state.current.name == 'home') {              
                  $state.go('home.pixelart', {'pixelartId': resp.data.data.id}, { reload: true });
                } else if ($state.current.name == 'galeria') {
                  $state.go('galeria.pixelart', {'pixelartId': resp.data.data.id}, { reload: true });
                }
              }
            })


          }, function(err) {
            console.error('ERR', err);
            $scope.pixelarterror = err.data.msg;
            //console.log('ke lo ke: '+$scope.pixelarterror);
          }); //end http post

        });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      });
    }
  }
})

/**
 * Get/Show individual pixelarts and Comments
 */
app.controller('pixelartCtrl', function($scope, $state, $stateParams, $http, Session, ngDialog) {

  $scope.loading_pixelart = true;
  $scope.pixelart = {};
  $http.get('http://pixelesp-api.herokuapp.com/imagenes/'+ $stateParams.pixelartId).then(function(resp) {
    $scope.pixelart = resp.data.data;

    pixelfavs = $scope.pixelart.favoritos;
    $scope.isFavorite = pixelfavs.map((el) => el.username).indexOf(userdata.username);

    //console.log('$scope.isFavorite '+$scope.isFavorite);

    // marcar como favorito
    $scope.markAs = function(type) {

      if (type >= 0) {
        $scope.removeFav();
      } else {
        $scope.addFav();
      }
    }

  /* ===== 
    Comentarios
          ===== */

    userdata = JSON.parse(window.localStorage.getItem('userdata'));
    $scope.currentUser = userdata;

    $scope.guardarComentario = function(comment, ngDialogProvider) {

      if (Session.id != null) {

        $scope.comment = {};
        $scope.comment.text = comment.text;
        $scope.comment.idusuario = userdata.id;
        $scope.comment.id_imagen = $scope.pixelart.id;
        $scope.comment.username = userdata.username;
        $scope.comment.avatar = userdata.imagen;

        $http.post('http://pixelesp-api.herokuapp.com/imgcomments', $scope.comment).then(function(resp) {
          //console.log(resp);

          $('#commentinput').val('');
          $scope.comment.text = '';
          $scope.pixelart.comentarios.push(resp.data.data);


        }, function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
        });
      }
    }

    $scope.doDeleteComment = function($id) {

      $http.delete('http://pixelesp-api.herokuapp.com/imgcomments/'+ $id).then(function(resp) {
        console.log(resp.data);

        $('#'+$id).fadeOut();

      }, function(err) {
        console.error('ERR', err);
      });
    }
  
  /*    ===== 
    ===== 
    ===== */

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })['finally'](function() {
      $scope.loading_pixelart = false;
  });

  // añadir a favoritos  
  $token = Session.id;
  $scope.addFav = function() {

    // your code
    $scope.imgfavoritos = {};
    $scope.imgfavoritos.idimagen = $scope.pixelart.id;
    $scope.imgfavoritos.imagen = userdata.imagen;
    $scope.imgfavoritos.username = userdata.username;
    $http.post('http://pixelesp-api.herokuapp.com/imgfavoritos', $scope.imgfavoritos, {headers: {'auth-token': $token}}).then(function(resp) {
      
      $scope.pixelart.favoritos.push(resp.data.data);
      $scope.isFavorite = 1;

    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    });

  }

  $scope.removeFav = function() {

    // your code
    $scope.imgfavoritos = {};
    $http.delete('http://pixelesp-api.herokuapp.com/imgfavoritos/' + $stateParams.pixelartId, {headers: {'auth-token': $token}}).then(function (resp) {

      // remove avatar from list
      $('.userfavs img[title='+userdata.username+']').hide();
      $scope.isFavorite = -1;

    }, function(err) {
     console.error('ERR', err);
     // err.status will contain the status code+

    });

  }

  // aprobar o eliminar pixelart
  if (Session.id != null) {

    $scope.imagen = {};
    $scope.doApprobal = function() {

      $scope.imagen.Titulo = $scope.pixelart.Titulo;
      $scope.imagen.Descripcion = $scope.pixelart.Descripcion;
      $scope.imagen.Aprobada = 1;

      $http.put('http://pixelesp-api.herokuapp.com/imagenes/'+ $stateParams.pixelartId, $scope.imagen).then(function(resp) {
        //console.log(resp.data);

        ngDialog.close();
        ngDialog.open({
          templateUrl: 'partials/messages.html',
          className: 'ngdialog-theme-plain card-message',
          cache: false,
          showClose: false,
          data: {
            class: 'card-inverse card-success',
            text: 'PixelArt aprobado!',
            footertext: 'Es un gran PixelArt!',
            time: 2
          },
          preCloseCallback: function(){            
            $state.go('encola', {}, { reload: true });
          }
        });

      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });
    }

    $scope.doDelete = function() {
      $http.delete('http://pixelesp-api.herokuapp.com/imagenes/'+ $stateParams.pixelartId, $scope.imagen).then(function(resp) {
        //console.log(resp.data);
        //$location.path('/app/imagenes');

        ngDialog.close();
        ngDialog.open({
          templateUrl: 'partials/messages.html',
          className: 'ngdialog-theme-plain card-message',
          cache: false,
          showClose: false,
          data: {
            class: 'card-inverse card-danger',
            text: 'PixelArt eliminado',
            footertext: 'No es PixelArt!',
            time: 2
          },
          preCloseCallback: function(){
            if ($state.current.name == 'encola') {              
              $state.go('encola', {}, { reload: true });
            } else if ($state.current.name == 'home') {
              $state.go('home', {}, { reload: true });
            } else if ($state.current.name == 'galeria') {
              $state.go('galeria', {}, { reload: true });
            }
          }
        })

      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      });
    }
  } // end if Session

})