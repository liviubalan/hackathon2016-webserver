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
    // var responsePromise = $http.get("https://sapi.emag.ro/products/DVBTMMBBM?source_id=7");

    // responsePromise.success(function(data, status, headers, config) {
    //     $scope.data = data;
    // });
    // responsePromise.error(function(data, status, headers, config) {
    //     alert("AJAX failed!");
    // });

    loadScript("index_files/homepage.js");
});


app.controller('ProductController',['$scope', '$http', '$sce', '$routeParams',
    function ($scope, $http, $sce, $routeParams) {
        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        var resorcesToLoad = [
            ['availability', 'json'],
            ['description', 'json'],
            ['gallery', 'json'],
            ['price', 'json'],
            ['reviews', 'json'],
            ['specs', 'html']
        ];

        for (var res in resorcesToLoad) {
            requestData("product/" + $routeParams.part_number + "/" + resorcesToLoad[res][0] + "." + resorcesToLoad[res][1]).then(function (data) {
                $scope.data = data;
            }, function (err) {
                var responsePromise = $http.get('http://api.hack1.smart-things.ro/' + err.resource);
                responsePromise.success(function (data, status, headers, config) {
                    var fileName = config.url.split("/");
                    fileName = fileName[fileName.length - 1];
                    fileName = fileName.split(".");
                    var last = fileName[0];
                    var ext = fileName[1];
                    $scope[last] = data;
                    saveData(err.resource, data);
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("AJAX failed!");
                });
            });
        }
    }]
);

setTimeout(function () {
    angular.bootstrap(document, ['eMAG-SP-RTC']);
}, 1000);













//==========================================================
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
