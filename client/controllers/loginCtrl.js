var app = angular.module('app')

app.controller('LoginCtrl', ['AuthService', '$location', function(AuthService, $location) {

    this.title = 'Login'

    var self = this

    this.submit = function(form) {

        AuthService.login(form.name, form.password)
            .then(function () {
                $location.path('/polls')
                form = {}
            })
            .catch(function (data) {
                form = {}
                self.error = true
                self.errorMessage = data.message
            });
    };

}])