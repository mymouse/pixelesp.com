/**
 * Get Posts Aprobados
 */
app.controller('getPosts', function($scope, $http, ngDialog) {

  $scope.imagenes = [];
  $http.get('http://pixelesp-api.herokuapp.com/imagenes').then(function(resp) {
    $scope.imagenes = resp.data.data;
    //console.log('Succes', resp.data.data);

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  });
})

/*
 * Upload pixelArt
 */
app.controller('newPost', function ($scope, $http, Upload, Session, $timeout, Cloudinary) {

  $scope.imagen = {};
  $scope.imagen.id = '';
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
            console.log('Success previaFromPC ' + resp.config.data.file.name + 'uploaded. Response: ' + JSON.stringify(resp.data));
            var urlPreviaPC = resp.data.url;
            $scope.imagen.Previa = '';
            $scope.imagen.Previa = urlPreviaPC.substr(urlPreviaPC.lastIndexOf('d/') + 2);

        }, function (resp) {
            console.log('Error status: ' + resp.status);
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
            console.log('Success previaCrop ' + resp.config.data.file.name + 'uploaded. Response: ' + JSON.stringify(resp.data));
            var urlPrevia = resp.data.url;
            $scope.imagen.Previa = urlPrevia.substr(urlPrevia.lastIndexOf('d/') + 2);

        }, function (resp) {
            console.log('Error status: ' + resp.status);
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
            console.log(resp.data);
            console.log('imagen subida a la api !');
           
            //$location.path('/app/galeria');
                  
          }, function(err) {
            console.error('ERR', err);
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