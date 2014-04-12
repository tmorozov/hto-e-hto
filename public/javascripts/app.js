angular.module("hto", [])
.controller("SelectTownController", function ($scope, $window) {
  var townTree = {
    states: [
      {
        name: "Київська",
        districts: [
          {
            name: "Кіївський",
            towns: [
              {
                name: "Кіїв"
              }
            ]
          }
        ]
      },
      {
        name: "Львівська",
        districts: [
          {
            name: "Львівський",
            towns: [
              {
                name: "Львів"
              }
            ]
          },
          {
            name: "Миколаївський",
            towns: [
              {
                name: "Миколаїв"
              }
            ]
          },
          {
            name: "Дрогобичський",
            towns: [
              {
                name: "Дрогобич"
              }
            ]
          },
          {
            name: "Трускавецький",
            towns: [
              {
                name: "Трускавець"
              }
            ]
          }
        ]
      }
    ]
  };

  $scope.query = {
    state: null,
    district: null,
    town: null
  };

  $scope.states = townTree.states;

  $scope.isQueryComplete = function () {
    return $scope.query.state && $scope.query.district && $scope.query.town;
  };

  $scope.GoToReport = function () {
    $window.location.href = "/reports.html";
  };

});