// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs).
        // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
        // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
        // useful especially with forms, though we would prefer giving the user a little more room
        // to interact with the app.
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // Set the statusbar to use the default style, tweak this to
            // remove the status bar on iOS or change it to use white instead of dark colors.
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            });
        $urlRouterProvider.otherwise("/");

    })
    .controller('HomeCtrl', function ($scope, $ionicPlatform, $cordovaGeolocation, $log, $ionicModal, $cordovaNetwork, $cordovaEmailComposer, $cordovaSpinnerDialog) {

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        var onSuccess = function onSuccess(position) {
            $scope.lat = (position) ? 6.4778534 : 6.4778534;
            $scope.long = (position) ? 7.580760400000031 : 7.580760400000031;
            $scope.map = {
                center: {
                    latitude: $scope.lat,
                    longitude: $scope.long
                },
                zoom: 16
            };
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: $scope.lat,
                    longitude: $scope.long
                },
                options: {
                    draggable: true
                },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker dragend');
                        $scope.lat = marker.getPosition().lat();
                        $scope.long = marker.getPosition().lng();
                        $log.log($scope.lat);
                        $log.log($scope.long);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };

        }
        var onError = function (err) {
            console.log("Erro getting position: " + err);
        }
        onSuccess();
        $scope.getMyLocation = function () {
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(onSuccess, onError);
        }
        document.addEventListener("deviceready", deviceReady, false);
        $ionicPlatform.ready(function () {
            deviceReady();
        });

        //window.plugins.spinnerDialog.show("title", "message", true);


        function deviceReady() {

            //            if ($cordovaNetwork.isOffline()) {
            //                alert("This application requires internet to work");
            //                navigator.app.exitApp();
            //            }



            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(onSuccess, onError);

        }

        $ionicModal.fromTemplateUrl('new-location.html', function (modal) {
            $scope.locationModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $ionicModal.fromTemplateUrl('about-app.html', function (modal) {
            $scope.aboutModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.changeLocation = function (lat, long) {
            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: long
                },
                zoom: 8
            };
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: lat,
                    longitude: long
                },
                options: {
                    draggable: true
                },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker dragend');
                        lat = marker.getPosition().lat();
                        long = marker.getPosition().lng();
                        $log.log(lat);
                        $log.log(long);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };
        };

        // Open our new task modal
        $scope.newLocation = function () {
            $scope.locationModal.show();
        };
        $scope.aboutApp = function () {
            $scope.aboutModal.show();
        };

        // Close the new task modal
        $scope.closeNewLocation = function () {
            $scope.locationModal.hide();
        };
        $scope.options = {
            scrollwheel: false
        };

        // Close the new task modal
        $scope.closeAboutApp = function () {
            $scope.aboutModal.hide();
        };

        var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }

                $scope.map = {
                    center: {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    },
                    zoom: 8
                };
                
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    },
                    options: {
                        draggable: true
                    },
                    events: {
                        dragend: function (marker, eventName, args) {
                            $log.log('marker dragend');
                            $scope.lat = marker.getPosition().lat();
                            $scope.long = marker.getPosition().lng();
                            $log.log($scope.lat);
                            $log.log($scope.long);

                            $scope.marker.options = {
                                draggable: true,
                                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                                labelAnchor: "100 0",
                                labelClass: "marker-labels"
                            };
                        }
                    }
                };
            }
        }
        $scope.searchbox = {
            template: 'searchbox.tpl.html',
            events: events
        };
    })