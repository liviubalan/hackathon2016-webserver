var app = angular.module('eMAG-SP-RTC', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'pages/index.html',
            controller: 'HomeController'
        })

        .when('/product/:part_number', {
            templateUrl: 'pages/product-page.html',
            controller: 'ProductController'
        })

        .otherwise({redirectTo: '/'});
});

app.controller('HomeController', function ($scope, $http) {
    $scope.message = 'Hello from HomeController';
    // var responsePromise = $http.get("https://sapi.emag.ro/products/DVBTMMBBM?source_id=7");

    // responsePromise.success(function(data, status, headers, config) {
    //     $scope.data = data;
    // });
    // responsePromise.error(function(data, status, headers, config) {
    //     alert("AJAX failed!");
    // });
});

app.controller('ProductController', function ($scope, $http, $route, $routeParams) {
    var resorcesToLoad = [
        'availability',
        'description',
        'gallery',
        'price',
        'reviews'
    ];

    var arr = ["p40","p41","p42"];
    ix = arr.indexOf(peer_id);
    if(ix != -1){
      arr.splice(ix,1);
    }
    connectToPeers(arr);

    for (var res in resorcesToLoad) {  
      requestData("/product/"+$routeParams.part_number+"/"+res+".json").then(function(data){
        $scope.data = angular.fromJson(data);
      },function(err){ 
        var responsePromise = $http.get('http://api.hack1.smart-things.ro/product/' + $routeParams.part_number + '/' + resorcesToLoad[res] + '.json');
        responsePromise.success(function (data, status, headers, config) {
            var last = config.url.split("/");
            last = last[last.length - 1];
            last = last.split(".");
            last = last[0];
            $scope[last] = angular.fromJson(data);
        });
        responsePromise.error(function (data, status, headers, config) {
            alert("AJAX failed!");
        });
      });
    }
});
