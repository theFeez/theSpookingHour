angular.module('ZachAttackService',[]).factory('ZachAttack',['$http',function($http){
    return{
        getZachPosts: function(){
            return $http.get('/zachPosts');
        }
    }
}]);
