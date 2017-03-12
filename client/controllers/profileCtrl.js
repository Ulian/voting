var app = angular.module('app')

app.controller('ProfileCtrl', ['AuthService', function (AuthService) {
  this.title = 'Profile'

  AuthService.getUserStatus()
    .then(data => {
      this.name = data.data.username
      this.list = data.data.polls
    })
}])
