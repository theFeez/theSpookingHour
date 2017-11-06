angular.module('ArchiveCtrl',[]).controller('ArchiveController',function($scope,Blog){
    Blog.getArchive().then(function(res){
        $scope.allPosts = res.data.allPosts;
    })
})
