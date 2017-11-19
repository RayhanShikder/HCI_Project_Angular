// Code goes here

var app = angular.module('myApp', ['ngYoutube']);

app.controller('mainCtrl', ['$scope', 'ytPlayer',
    function ($scope, ytPlayer) {

        $scope.playerReady = false;
        $scope.ytPlayer;

        $scope.videoId = 'iGk5fR-t5AU';

        $scope.$on('ngYoutubePlayer:onPlayerReady', function (event, data, id) {
            $scope.ytPlayer = ytPlayer;

            if ($scope.ytPlayer['player1']) {
                $scope.playerReady = true;
                $scope.$apply();
            }
        });

    }
]);