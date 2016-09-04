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

app.filter('price', function () {
    return function (text, classCss, strike, feedback) {
        var ret;
        var strikeOpen = typeof strike !== 'undefined' ? '<s>': '';
        var strikeClose = typeof strike !== 'undefined' ? '</s>': '';
        var feedbackHTML = typeof feedback !== 'undefined' ? '<span class="product-this-deal">(-'+feedback+'%)</span>' : '';
        if(typeof text !== 'undefined') {
            text = text.toString().split('.');
            ret = '<p class="'+classCss+'">'+strikeOpen+'' + text[0] + '<sup>' + text[1] + '</sup> <span>Lei</span>'+strikeClose+'</p>';
        } else {
            ret = '';
        }
        return ret;
    };
});

app.controller('HomeController',['$scope', '$http', '$sce', '$routeParams',
    function ($scope, $http, $sce, $routeParams) {
        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        var resorcesToLoad = [
            ['live_widget', 'json'],
            ['slider', 'json'],
            ['widgets', 'json'],
            ['menu', 'html']
        ];

        for (var res in resorcesToLoad) {
            requestData("homepage/" + resorcesToLoad[res][0] + "." + resorcesToLoad[res][1]).then(function (data) {
                res = getResourceNameFromURL(data.resource);
                $scope.$apply(function(){
                    $scope[res] = data.data;
                });
                if(res=='menu'){
                    loadScript("index_files/homepage.js");
                }
            }, function (err) {
                var responsePromise = $http.get('http://api.hack1.smart-things.ro/' + err.resource);
                responsePromise.success(function (data, status, headers, config) {
                    res = getResourceNameFromURL(config.url);
                    $scope[res] = data;
                    saveData(err.resource, data);
                    if(res=='menu'){
                        loadScript("index_files/homepage.js");
                    }
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("AJAX failed!");
                });
            });
        }

        $scope.totalPeerConnections = totalPeerConnections || 0;
        socket.on('update', function (data) {
            $scope.$apply(function() {
                $scope.totalPeerConnections = data.peer_list.length;
            });
        });

        socket.on('news', function (data) {
            $scope.$apply(function() {
                $scope.totalPeerConnections = data.peer_list.length;
            });
        });
    }]
);
    // var responsePromise = $http.get("https://sapi.emag.ro/products/DVBTMMBBM?source_id=7");

    // responsePromise.success(function(data, status, headers, config) {
    //     $scope.data = data;
    // });
    // responsePromise.error(function(data, status, headers, config) {
    //     alert("AJAX failed!");
    // });

//     loadScript("index_files/homepage.js");
// });


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

        var loadResources = function() {
          for (var res in resorcesToLoad) {
              requestData("product/" + $routeParams.part_number + "/" + resorcesToLoad[res][0] + "." + resorcesToLoad[res][1]).then(function (data) {
                  res = getResourceNameFromURL(data.resource);
                  $scope.$apply(function(){
                      $scope[res] = data.data;
                  });
              }, function (err) {
                  var responsePromise = $http.get('http://api.hack1.smart-things.ro/' + err.resource);
                  responsePromise.success(function (data, status, headers, config) {
                      res = getResourceNameFromURL(config.url);
                      $scope[res] = data;
                      saveData(err.resource, data);
                  });
                  responsePromise.error(function (data, status, headers, config) {
                      alert("AJAX failed!");
                  });
              });
          }  
        };
        loadResources();
        
        socket.on('invalidate', function (data) {
          setTimeout(loadResources, 3000);
        });

        $scope.totalPeerConnections = totalPeerConnections || 0;
        socket.on('update', function (data) {
            $scope.$apply(function() {
                $scope.totalPeerConnections = data.peer_list.length;
            });
        });

        socket.on('news', function (data) {
            $scope.$apply(function() {
                $scope.totalPeerConnections = data.peer_list.length;
            });
        });
    }]
);

setTimeout(function () {
    angular.bootstrap(document, ['eMAG-SP-RTC']);
}, 1000);





//======================== UTILS ==================================
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


function getResourceNameFromURL(url) {
    var fileName = url.split("/");
    fileName = fileName[fileName.length - 1];
    fileName = fileName.split(".");
    var last = fileName[0];
    return last;
}