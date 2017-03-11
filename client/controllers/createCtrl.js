var app = angular.module('app')

app.controller('CreateCtrl', ['$http', '$location', '$route', function ($http, $location, $route) {
  var self = this

  this.title = 'Create Poll'

  this.question = ''
  this.inputs = [0, 1]
  this.values = []

  this.addOne = function (input) {
    if (input === this.inputs.length - 1) {
      this.inputs.push(input + 1)
    }
  }

  this.removeLast = function (input, values, event) {
    if (input === this.inputs.length - 2 && this.inputs.length > 2 && values[input] === undefined && event.keyCode !== 9) {
      this.inputs.pop()
    }
  }

  this.submit = function () {
    const question = self.question
    let options = self.values.join(',')

    if (options[options.length - 1] === ',') {
      options.pop()
    }

    $http.post('/api/poll', {title: question, options: options})
      .then(function (response) {
        if (response.status === 201) {
          self.created = true
          self.response = true
          self.responseMessage = 'Poll created'
          self.alert = 'success'
          $location.path('/profile')
          $route.reload()
        }
      },
      function (response) {
        self.response = true
        self.responseMessage = 'A problem ocurred'
        self.alert = 'danger'
      })
  }
}])
