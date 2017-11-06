angular.module('appRoutes',[]).config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $routeProvider

        .when('/',{
            templateUrl:'views/home.html',
            controller:'MainController'
        })
        .when('/about',{
            templateUrl:'views/about.html',
            controller:''
        })
        .when('/blog',{
            templateUrl:'views/archive.html',
            controller:'ArchiveController'
        })
        .when('/episodes',{
            templateUrl:'views/episodes.html'
        })
        .when('/zachAttack',{
            templateUrl:'views/zachAttack.html',
            controller:'ZachAttackController'
        })

        $locationProvider.html5Mode(true);
}])
