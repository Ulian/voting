var app = angular.module('app')

app.controller('RegisterCtrl', ['AuthService', '$location', function (AuthService, $location) {
  this.title = 'Register'

  this.submit = form => {
    AuthService.register(form.name, form.email, form.password, form.passwordConfirm)
      .then(function () {
        AuthService.login(form.name, form.password)
          .then(function () {
            $location.path('/polls')
          })
        form = {}
      })
      .catch(function (data) {
        form = {}
        this.error = true
        this.errorMessage = data.message
      })
  }
}])
