//create app
var app = angular.module('MyApp', ['ngMaterial', 'ngRoute']);
var json;
var myJsonURL = "https://api.myjson.com/bins/2rhv1";

//routing
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
		templateUrl: 'pages/main.html'
    }).
      when('/intro', {
      	templateUrl: 'pages/intro.html'
    }).

    when('/', {
      templateUrl: 'pages/intro.html'
    }).

    when('/about', {
      templateUrl: 'pages/about.html'
    });

}]);

//init three.js
init();

//load JSON data from server
loadJSON();

//controller for main screen with three.js
app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){

  //side nav on / off
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();

    console.log("sidebar toggled");
  };

  $scope.changeTempo = function() {
    console.log("tempo changed");
    setBPM($scope.color.blue);
  }

  $scope.terrainSwitch = function() {
    terrainDanceBool = $scope.color.terrain;
  }

  $scope.treeSwitch = function() {
    treeDanceBool = $scope.color.tree;

    console.log(treeDanceBool);

  }

  $scope.setBass = function() {
    bassFreq = $scope.color.red;
  }

  $scope.saveSettings = function() {
    console.log("saving");

    saveJSON();
  }

  //load from server
  $scope.loadSettings = function() {
    console.log("loading");

    loadJSON();

    try {
      $scope.color = {
        red: json.red,
        green: json.green,
        blue: json.blue,
        zAngle: json.fov,
        yAngle: json.bop
      } 
    }
    catch(err)
    {
      $scope.color = {
        red: data.red,
        green: data.green,
        blue: data.blue,
        zAngle: data.fov,
        yAngle: data.bop
      }
    }
    setBPM($scope.color.blue);
    bassFreq = $scope.color.red;

  }

  $scope.color = {
      red: data.red,
      green: data.green,
      blue: data.blue,
      zAngle: data.fov,
      yAngle: data.bop,
      terrain: false,
      tree: true
  }


  bassFreq = $scope.color.red;

  setupIntervals();

  terrainDanceBool = $scope.color.terrain;
  treeDanceBool = $scope.color.tree;

}]);

//turns audio off when going back to other pages
app.controller('IntroCtrl', ['$scope', function($scope){

  terrainDanceBool = false;
  nullIntervals();

  console.log("back to start");

}]);


//load JSON data from server
function loadJSON()
{
  $.get(myJsonURL, function (data, textStatus, jqXHR) {
      json = (data);
      console.log(json);
  });
}

//save JSON data from server
function saveJSON()
{
  json = {"red":x,"green":y,"blue":z,"fov":zAngle, "bop": yAngle};

  $.ajax({
    url: myJsonURL,
    type: "PUT",
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
        console.log("uploaded");
        loadJSON();
    }

  });
}

// function changeTempoNA()
// {
//   setBPM(z);
// }


