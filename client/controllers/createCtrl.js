var app = angular.module('app')

app.controller('CreateCtrl', ['$http', '$location', '$route', function ($http, $location, $route) {
  this.title = 'Create Poll'

  this.question = ''
  this.inputs = [0, 1]
  this.values = []

  this.addOne = input => {
    if (input === this.inputs.length - 1) {
      this.inputs.push(input + 1)
    }
  }

  this.removeLast = (input, values, event) => {
    if (input === this.inputs.length - 2 && this.inputs.length > 2 && values[input] === undefined && event.keyCode !== 9) {
      this.inputs.pop()
    }
  }

  this.submit = () => {
    const title = this.question
    let options = this.values.join(',')

    if (options[options.length - 1] === ',') {
      options.pop()
    }

    $http.post('/api/poll', {title, options})
      .then(response => {
        if (response.status === 201) {
          this.created = true
          this.response = true
          this.responseMessage = 'Poll created'
          this.alert = 'success'
          $location.path('/profile')
          $route.reload()
        }
      }, response => {
        this.response = true
        this.responseMessage = 'A problem ocurred'
        this.alert = 'danger'
      })
  }
}])
