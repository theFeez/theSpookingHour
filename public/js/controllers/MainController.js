angular.module('MainCtrl',[]).controller('MainController',function($scope,Blog){
    console.log(Blog.getLatest());
    Blog.getLatest().then(function(res){
        $scope.latest = res.data;
    })
});
