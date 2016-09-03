var app = angular.module('eMAG-SP-RTC', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl : 'pages/index.html',
    controller  : 'HomeController'
  })

  .when('/blog', {
    templateUrl : 'pages/product.html',
    controller  : 'ProductController'
  })

  .otherwise({redirectTo: '/'});
});

app.controller('HomeController', function($scope) {
  $scope.message = 'Hello from HomeController';
});

app.controller('ProductController', function($scope) {
  $scope.message = 'Hello from ProductController';
});
