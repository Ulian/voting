var app = angular.module('app')

app.controller('PollCtrl', ['$routeParams', '$http', '$location', '$route', function ($routeParams, $http, $location, $route) {
  this.angularEquals = angular.equals

  this.share = encodeURIComponent($location.absUrl())

  this.labels = []
  this.data = []

  this.load = function () {
    $http.get('/api/poll/' + $routeParams.id)
      .then(data => {
        const poll = data.data
        this.title = poll.title
        this.owner = poll.owner
        this.options = poll.options
        this.type = 'Pie'
        this.labels = []
        this.data = []
        this.options.forEach(option => {
          this.labels.push(option.name)
          this.data.push(option.votes.length)
        })
      })
  }

  this.load()

  this.vote = vote => {
    $http.post(`/api/poll/${$routeParams.id}/${vote}`)
      .then(data => {
        if (data.status === 201) {
          this.load()
          this.added = true
          this.addedMessage = 'Your vote was submited'
          this.alert = 'success'
        }
      }, () => {
        this.added = true
        this.addedMessage = 'You already vote in this poll'
        this.alert = 'danger'
      })
  }

  this.remove = () => {
    $http.delete(`/api/poll/${$routeParams.id}`)
      .then(() => {
        $location.path('/profile')
        $route.reload()
      },
      () => {
        this.added = true
        this.addedMessage = 'Is not your poll'
        this.alert = 'danger'
      })
  }

  this.addOption = option => {
    $http.post(`/api/poll/${$routeParams.id}`, { option })
      .then(response => {
        if (response.status === 201) {
          this.optionAdded = true
          this.optionAddedMessage = 'Option added'
          this.optionAlert = 'success'
          this.load()
        } else {
          this.optionAdded = true
          this.optionAddedMessage = 'Option cannot be added'
          this.optionAlert = 'danger'
        }
      }, () => {
        this.optionAdded = true
        this.optionAddedMessage = 'Option cannot be added'
        this.optionAlert = 'danger'
      })
  }
}])
