angular.module('BlogService',[]).factory('Blog',['$http',function($http){
    return{
        getArchive : function(){
            return $http.get('/archive');
        },

        getPost : function(episode,name){
            return $http.get('/posts/'+episode+'/'+name);
        },

        getLatest : function(){
            return $http.get('/latestPosts');
        }
    }
}]);
