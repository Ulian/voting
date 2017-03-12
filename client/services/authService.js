var app = angular.module('app')

app.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {
  let user = false

  const isLoggedIn = () => {
    return user
  }

  const getUserStatus = () => {
    return $http.get('/api/status')
      .success((data, status) => {
        if (data._id && data.username && data.email && status === 200) {
          user = true
          return data
        } else {
          user = false
        }
      })
      .error((data) => {
        user = false
      })
  }

  const login = (login, password) => {
    var deferred = $q.defer()

    $http.post('/api/login', { login, password })
      .success((data, status) => {
        if (status === 200) {
          user = true
          deferred.resolve(data)
        } else {
          user = false
          deferred.reject(data)
        }
      })
      .error(data => {
        user = false
        deferred.reject(data)
      })
    return deferred.promise
  }

  function register (username, email, password, passwordRepeat) {
    var deferred = $q.defer()

    $http.post('/api/register', { username, email, password, passwordRepeat })
      .success((data, status) => {
        if (status === 201) {
          user = true
          deferred.resolve(data)
        } else {
          user = false
          deferred.reject(data)
        }
      })
      .error(data => {
        user = false
        deferred.reject(data)
      })
    return deferred.promise
  }

  return ({
    isLoggedIn,
    getUserStatus,
    login,
    register
  })
}])
