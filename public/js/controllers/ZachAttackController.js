angular.module('ZachAttackCtrl',[]).controller('ZachAttackController',function($scope,$sce,ZachAttack){

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    ZachAttack.getZachPosts().then(function(res){
        $scope.zachPosts = res.data.zachPosts;
    })
})
