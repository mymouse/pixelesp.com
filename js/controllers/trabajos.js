

//listar trabajos
app.controller('getTrabajos', function($scope, $http) {

  $scope.trabajos = [];
    $http.get('http://pixelesp-api.herokuapp.com/trabajos').then(function(resp) {
      $scope.trabajos = resp.data.data;

    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    });

  })
  




  //trabajo nuevo:
     app.controller('TrabajoNuevoCtrl', function($scope, $stateParams, $http, $ionicPopup, $location, $rootScope) {
            
        $scope.trabajo={};
        $scope.trabajo.Titulo='';
        $scope.trabajo.Descripcion='';
        $scope.trabajo.id=''; 
  
  if (Session.id != null) {
          $scope.doRegister = function() {
    
    $scope.trabajo.username =''; 

    $http.get('http://pixelesp-api.herokuapp.com/me', {headers: {'auth-token': $rootScope.userToken}}).then(function(resp) {


      userdata = JSON.parse(window.localStorage.getItem('userdata'));
      $scope.trabajo.username = userdata.username; 
      $scope.trabajo.idusuario = userdata.id;
      $scope.trabajo.imagen = userdata.imagen;

        $http.post('http://pixelesp-api.herokuapp.com/trabajos',$scope.trabajo).then(function(resp) {
              console.log(resp.data);
   ngDialog.closeAll();
              ngDialog.open({
          templateUrl: 'partials/messages.html',
          className: 'ngdialog-theme-plain card-message',
          cache: false,
          showClose: false,
          data: {
            class: 'card-inverse card-success',
            text: 'Trabajo creadp',
            footertext: 'Muchas gracias!',
            time: 2
          },
          preCloseCallback: function(){
            $state.go('home.thread', { 'TrabajoId': resp.data.data.id }, { reload: true });
          }

        })
        }, function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
        });


    }, function(err) {
      console.error('ERR', err);
     
    }); 
  };
  
};
}); 