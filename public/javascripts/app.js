angular.module("hto", ['n3-charts.linechart'])
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

  $scope.charts = {
    parties: {
      data: [],
      options: {
        series: [
          {
            y: "percent",
            label: "Пропуски сессій по партіях",
            color: "#aa0000",
            type: "column",
            thickness: undefined
          }
        ],

        axes: {
          x: {
            labelFunction: function(value) {
              obj = $scope.charts.parties.data[value];
              if(obj && obj.name) {
                return obj.name;
              }
              return $scope.charts.parties.data[value];
            }
          },
          y: {
            type: "linear",
            key: 'percent'
          }
        },
        lineMode: "linear",
        tension: 0.7,
        tooltipMode: "default"
      }
    }
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

    var percents = _.map(grouped, function(val, i) {
      return {
        name: val.name, 
        percent: val.propusk*100/val.total
      };
    });

    var res = _.sortBy(percents, function(val) {
      return val.percent;
    })

    res = _.map(res, function(val, i) {
      val.x = i;
      return val;
    });

    res.unshift({name: "Партія", percent: "Процент пропусків", x: "N"});

    return res;
  }

  function onReport(data) {
    $scope.data.tableAll = data;
    $scope.data.tableParties = getParties(data);
    $scope.charts.parties.data = $scope.data.tableParties.slice(1);
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