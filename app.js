var app = angular.module('eMAG-SP-RTC', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl : 'pages/index.html',
    controller  : 'HomeController'
  })

  .when('/product/:part_number', {
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

app.controller('ProductController', function($scope, $http, $route, $routeParams) {
  $scope.message = 'Hello from ProductController';
  $scope.pnk = $routeParams.part_number;
  console.log($scope.pnk);

  var resorcesToLoad = ['availability', 'description', 'gallery', 'price', 'reviews'];


  var responsePromise = $http.get('http://api.hack1.smart-things.ro/product/'+$routeParams.part_number+'/price.json');

  responsePromise.success(function(data, status, headers, config){
      $scope.data = angular.fromJson(data);
  });
  responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
  });


//var data = '{"price" : 45.99,"old_price": 79.99,"discount": 42,"discount_type": "%","product_title":"Tablete Finish All in One, 56 buc, 1041 g"}';
//$scope.data = angular.fromJson(data);


});