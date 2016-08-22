/*
 * File Upload
 */
app.controller('UploadController', function($scope, FileUploader) {
	var uploader = $scope.uploader = new FileUploader({
		url: 'uploads/upload.php'
	});

	// FILTERS
	uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});

	uploader.onAfterAddingFile  = function(item) {
		//uno a la vez
		if(uploader.queue.length > 1){
			uploader.queue.splice(0, uploader.queue.splice.length -1);
		}
	};

	/* end controller */
});