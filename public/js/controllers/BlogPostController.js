angular.module('BlogPostCtrl',[]).controller('BlogPostController',function($scope,$routeParams,Blog){
    Blog.getPost($routeParams.episode,$routeParams.name).then(function(res){
        console.log('hi');
        $scope.fullName = res.data.fullName;
        $scope.title = res.data.title;
        $scope.name = res.data.name;
        $scope.episode = res.data.episode;
        $scope.text = res.data.text;
        $scope.comments = res.data.comments;
    })
})
