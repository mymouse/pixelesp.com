app.directive('closeDialog', function(ngDialog, $timeout) {
  return {
    link: function(scope, element, attrs) {
      if(attrs.closeDialog) {
        $timeout(function(){ngDialog.close()}, attrs.closeDialog * 1000);
      }
      element.bind('click', function(element) {
        ngDialog.close();
      })
    }
  }
});