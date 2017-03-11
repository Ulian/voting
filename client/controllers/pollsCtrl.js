var app = angular.module('app')

app.controller('PollsCtrl', ['$http', function ($http) {
  this.title = 'Poll List'

  var self = this

  $http.get('/api/polls')
    .success(function (data) {
      self.list = data
    })
}])
