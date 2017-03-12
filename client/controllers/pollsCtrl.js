var app = angular.module('app')

app.controller('PollsCtrl', ['$http', function ($http) {
  this.title = 'Poll List'

  $http.get('/api/polls')
    .success(data => {
      this.list = data
    })
}])
