angular.module('BlogService',[]).factory('Blog',['$http',function($http){
    return{
        getArchive : function(){
            return $http.get('/archive');
        },

        getPost : function(episode,name){
            return $http.get('/getPost/'+episode+'/'+name);
        },

        getLatest : function(){
            return $http.get('/latestPosts');
        }
    }
}]);
