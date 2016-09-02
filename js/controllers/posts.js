/*
 * Upload pixelArt
 */

app.controller('newPost', function ($scope, $http, Upload, Session, $timeout, Cloudinary) {

    $scope.imagen = {};
    $scope.imagen.id = '';
    $scope.imagen.Titulo = '';
    $scope.imagen.Descripcion = '';
    $scope.imagen.Imagen = ''; 
    $scope.imagen.Previa = ''; 

    if (Session.id != null) {

      $scope.uploadPic = function(file, previa) {

        userdata = JSON.parse(window.localStorage.getItem('userdata'));
        $scope.imagen.idusuario = userdata.id;

        previa.upload = Upload.upload({
          url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
          data: {
            upload_preset: 'c5o7wpot',
            tags: 'pixelart',
            folder: 'Previa',
            username: userdata.username,
            file: Upload.dataUrltoBlob(previa, file.name),
            origFile: file
          },
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            var urlPrevia = resp.data.url;
            $scope.imagen.Previa = urlPrevia.substr(urlPrevia.lastIndexOf('d/') + 2);

        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

        file.upload = Upload.upload({
          url: 'https://api.cloudinary.com/v1_1/hyktxhgfc/upload',
          data: {
            upload_preset: 'c5o7wpot',
            tags: 'pixelart',
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
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    }
})