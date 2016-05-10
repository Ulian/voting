var app = angular.module('app')

app.factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    
    var user = false
    
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        register: register
    })
    
    function isLoggedIn() {
        if(user) return true
        return false
    }
    
    function getUserStatus() {
        return $http.get('/api/status')
            .success(function (data, status) {
                if(data._id && data.username && data.email && status === 200) {
                    user = true
                    return data
                } else {
                    user = false
                }
            })
            .error(function (data) {
                user = false
            })
    }
   
    function login(user, password) {
        var deferred = $q.defer()
        
        $http.post('/api/login', { login: user, password: password })
            .success(function(data, status) {
                if(status === 200) {
                    user = true
                    deferred.resolve(data)
                } else {
                    console.log('no')
                    user = false
                    deferred.reject(data)
                }
            })
            .error(function(data) {
                user = false
                deferred.reject(data)
            })
        
        return deferred.promise
    }
    
    function register(user, email, password, confirmPassword) {
        var deferred = $q.defer()
        
        $http.post('/api/register', { username: user, email: email, password: password, passwordRepeat: confirmPassword })
            .success(function(data, status) {
                if(status === 201) {
                    user = true
                    deferred.resolve(data)
                } else {
                    user = false
                    deferred.reject(data)
                }
            })
            .error(function(data) {
                user = false
                deferred.reject(data)
            })
        
        return deferred.promise
    }
    
}]);
