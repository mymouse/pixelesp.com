/**
* Sidebar Controller
*/
app.controller('sideBar', function($scope) {
	$scope.items = [
		{
			title: 'Inicio',
			icon: 'home',
			state: 'home'
		}, { 
			title: 'Galería',
			icon: 'picture-o',
			state: 'galeria'
		}, { 
			title: 'Comunidad',
			icon: 'users',
			state: 'comunidad'
		}, { 
			title: 'Trabajo',
			icon: 'briefcase',
			state: 'trabajo'
		}, { 
			title: 'App',
			icon: 'android',
			state: 'app'
		}, { 
			title: 'Contacto',
			icon: 'envelope-o',
			state: 'contacto'
		}
	];
	$scope.selected = 0;

	$scope.select= function(index) {
		$scope.selected = index; 
	};
})