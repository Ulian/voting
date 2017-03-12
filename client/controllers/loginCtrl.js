var app = angular.module('app')

app.controller('LoginCtrl', ['AuthService', '$location', function (AuthService, $location) {
  this.title = 'Login'

  this.submit = form => {
    AuthService.login(form.name, form.password)
      .then(() => {
        $location.path('/polls')
        form = {}
      }, (data) => {
        form = {}
        this.error = true
        this.errorMessage = data.message
      })
      .catch(() => {
        form = {}
        this.error = true
        this.errorMessage = 'A problem ocurred'
      })
  }
}])
