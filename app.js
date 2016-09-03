var app = angular.module('eMAG-SP-RTC', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl : 'pages/index.html',
    controller  : 'HomeController'
  })

  .when('/product', {
    templateUrl : 'pages/product-page.html',
    controller  : 'ProductController'
  })

  .otherwise({redirectTo: '/'});
});

app.controller('HomeController', function($scope, $http) {
  $scope.message = 'Hello from HomeController';
  // var responsePromise = $http.get("https://sapi.emag.ro/products/DVBTMMBBM?source_id=7");

  // responsePromise.success(function(data, status, headers, config) {
  //     $scope.data = data;
  // });
  // responsePromise.error(function(data, status, headers, config) {
  //     alert("AJAX failed!");
  // });
});

app.controller('ProductController', function($scope, $http) {
  $scope.message = 'Hello from ProductController';
  // var responsePromise = $http.get("https://sapi.emag.ro/products/DVBTMMBBM?source_id=7");

  // responsePromise.success(function(data, status, headers, config) {
  //     $scope.data = data;
  // });
  // responsePromise.error(function(data, status, headers, config) {
  //     alert("AJAX failed!");
  // });
});
