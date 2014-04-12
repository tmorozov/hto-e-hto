App
.service("ReportsLoader", function($http) {
  function loadReport(cb) {
    $http.get("/api/zvit")
    .success(function(data, status, headers, config) {
      cb({
        header: data[0],
        body: data.slice(1)
      });
    });
  }

  return {
    loadReport: loadReport
  }
})
.service("TownTree", function () {
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

  return townTree;
})
.service("PrepareHighChartData", function() {
  function barChartPresence(prepared, text) {
    return {
      options: {
          chart: {
              type: 'bar'
          },
        plotOptions: {
          series: {
            stacking: 'percentage'
          }
        },
      },
      series: [{
          color: '#00FF00',
          name: 'Процент присутності',
          data: prepared.percentGood
      },{
          color: '#FF0000',
          name: 'Процент пропусків',
          data: prepared.percentBad
      }],
      title: {
          text: text
      },
      xAxis: {
          categories: prepared.categories
      },
      yAxis: {
          plotLines: [{
                color: '#FF0000',
                width: 2,
                value: 50
            }]        
      },

      loading: false
    };
  }

  function prepareAbcenseSeries(table, nameId, abcenseId) {
    var prepared = {
      percentGood: [],
      percentBad: [],
      categories: []
    };

    _.forEach(table.body, function(row) {
      prepared.percentBad.push(+row[abcenseId]);
      prepared.percentGood.push(100-(+row[abcenseId]));
      prepared.categories.push(row[nameId]);      
    });

    return prepared;
  }
  function PartiesBarChart(table) {
    var prepared = prepareAbcenseSeries(table, 0, 1);
    return barChartPresence(prepared, 'Відвідування сессій партіями');
  }

  function DeputatesBarChart(table) {
    var prepared = prepareAbcenseSeries(table, 0, 6);
    return barChartPresence(prepared, 'Відвідування сессій депутатами');
  }

  return {
    PartiesBarChart: PartiesBarChart,
    DeputatesBarChart: DeputatesBarChart
  };
})
.service("ReportConverter", function () {
  function getParties(data) {
    var byParty = _.groupBy(data.body, function(row) {
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
      return [val.name, val.propusk*100/val.total];
    });

    var res = _.sortBy(percents, function(val) {
      return val[1];
    });

    return {
      header: ["Партія", "Процент пропусків"],
      body: res
    };
  }

  return {
    GroupByParty: getParties
  };
});