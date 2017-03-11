var app = angular.module('app')

app.controller('ProfileCtrl', ['AuthService', function (AuthService) {
  this.title = 'Profile'

  var self = this

  AuthService.getUserStatus()
    .then(function (data) {
      self.name = data.data.username
      self.list = data.data.polls
    })
}])
