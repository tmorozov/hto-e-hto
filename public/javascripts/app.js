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

})
.controller("ReportTableController", function($scope, ReportsLoader) {
  $scope.data = {
    tableAll: [],
    tableParties: []
  };

  ReportsLoader.loadReport(onReport);

  function getParties(data) {
    var rows = data.slice(1);
    var byParty = _.groupBy(rows, function(row) {
      return row[10];
    });

    var grouped =  _.map(byParty, function(party) {
      var memoInit = {name:'', propusk: 0, total: 0};
      return _.reduce(party, function(memo, dep) {
        memo.name = dep[10];
        memo.propusk += (+dep[1]) + (+dep[2]);
        memo.total += +dep[9];

        return memo;
      }, memoInit);
    });

    console.log(grouped);

    var percents = _.map(grouped, function(val) {
      return {
        name: val.name, 
        percent: val.propusk*100/val.total
      };
    });

    var res = _.sortBy(percents, function(val) {
      return val.percent;
    })
    res.unshift({name: "Партія", percent: "Процент пропусків"});

    console.log(res);
    return res;
  }

  function onReport(data) {
    $scope.data.tableAll = data;
    $scope.data.tableParties = getParties(data);
  }
})
.service("ReportsLoader", function($http) {
  function loadReport(cb) {
    $http.get("/api/zvit")
    .success(function(data, status, headers, config) {
      cb(data);
    });
  }

  return {
    loadReport: loadReport
  }
});