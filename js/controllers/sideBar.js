/**
* Sidebar Controller
*/
app.controller('sideBar', function($scope) {
	$scope.items = [
		{
			title: 'Inicio',
			icon: 'home',
			href: '#/'
		}, { 
			title: 'Galería',
			icon: 'picture-o',
			href: '#/galeria'
		}, { 
			title: 'Trabajo',
			icon: 'briefcase',
			href: '#/trabajo'
		}, { 
			title: 'Foro',
			icon: 'comments-o',
			href: '#/foro'
		}, { 
			title: 'Comunidad',
			icon: 'users',
			href: '#/comunidad'
		}, { 
			title: 'Contacto',
			icon: 'envelope-o',
			href: '#/contacto'
		}
	];
	$scope.selected = 0;

	$scope.select= function(index) {
		$scope.selected = index; 
	};
})