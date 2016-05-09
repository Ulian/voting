var app = angular.module('app')

app.controller('PollCtrl', ['$routeParams', '$http', '$location', '$route', function($routeParams, $http, $location, $route) {

    this.angularEquals = angular.equals

    this.id = $routeParams.id
    var self = this

    this.share = encodeURIComponent($location.absUrl())

    this.labels = []
    this.data = []

    this.test = function() {
        $http.get('/api/poll/' + $routeParams.id)
        .then(function(data) {
            var poll = data.data
            self.title = poll.title
            self.owner = poll.owner
            self.options = poll.options
            self.type = 'Pie'
            self.labels = []
            self.data = []
            self.options.forEach(function(option) {
                self.labels.push(option.name)
                self.data.push(option.votes.length)
            })
        })
    }

    this.test()
    
    this.vote = function(vote) {
        $http.post('/api/poll/' + $routeParams.id + '/' + vote)
            .then(function(data) {
                if(data.status === 201) {
                    self.test()
                    self.added = true
                    self.addedMessage = 'Your vote was submited'
                    self.alert = 'success'
                }
            },
            function(data) {
                self.added = true
                self.addedMessage = 'You already vote in this poll'
                self.alert = 'danger'
            })
    }
    
    this.remove = function(poll) {
        $http.delete('/api/poll/' + poll)
            .then(function(response) {
                $location.path('/profile')
                $route.reload()
            },
            function(response) {
                self.added = true
                self.addedMessage = 'Is not your poll'
                self.alert = 'danger'
            })
    }
    
    this.addOption = function(option) {
        $http.post('/api/poll/' + $routeParams.id, {option: option})
            .then(function(response) {
                if(response.status === 201) {
                    self.optionAdded = true
                    self.optionAddedMessage = 'Option added'
                    self.optionAlert = 'success'
                    self.test()
                } else {
                    self.optionAdded = true
                    self.optionAddedMessage = 'Option cannot be added'
                    self.optionAlert = 'danger'
                }
            }, function() {
                self.optionAdded = true
                self.optionAddedMessage = 'Option cannot be added'
                self.optionAlert = 'danger'
            })
    }

}])