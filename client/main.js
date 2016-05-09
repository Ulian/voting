var app = angular.module('app', ['ngRoute', 'angularMoment', 'chart.js'])

app.config(function($routeProvider) {
    $routeProvider
        .when('/polls', {
            templateUrl: 'partials/poll_list.html',
            controller: 'PollsCtrl',
            access: {
                loggedAllow: true,
                restricted: false
            }
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            access: {
                loggedAllow: false,
                restricted: false
            }
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl',
            access: {
                loggedAllow: false,
                restricted: false
            }
        })
        .when('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl',
            access: {
                loggedAllow: true,
                restricted: true
            }
        })
        .when('/poll/:id', {
            templateUrl: 'partials/poll.html',
            controller: 'PollCtrl',
            access: {
                loggedAllow: true,
                restricted: false
            }
        })
        .when('/create', {
            templateUrl: 'partials/create.html',
            controller: 'CreateCtrl', 
            access: {
                loggedAllow: true,
                restricted: true
            }
        })
        .otherwise({
            redirectTo: '/polls'
        });
});

app.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        AuthService.getUserStatus()
            .then(function(response){
                $rootScope.userId = response.data._id
                $rootScope.loggedIn = AuthService.isLoggedIn()
                if(next.access.loggedAllow == false && AuthService.isLoggedIn()){
                    $location.path('/polls')
                    $route.reload()
                }
            },
            function() {
                if(next.access.restricted == true && !AuthService.isLoggedIn()){
                    $location.path('/polls')
                    $route.reload()
                }
            });
        });
});