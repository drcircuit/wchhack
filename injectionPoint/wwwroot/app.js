angular.module("haxstore", [])
    .controller("main", ["$http", "$scope", function ($http, $scope) {
        $scope.products = [];
        $scope.searchFor = (word) => {
            $http.get("/products?search=" + word)
                .then((res) => {
                    $scope.products = res.data;
                }, (err) => {
                    console.log(err);
                });
        }
        $http.get("/products")
            .then((res) => {
                $scope.products = res.data;
            }, (err) => { console.log(err) });
    }]);