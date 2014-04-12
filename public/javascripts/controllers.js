App
.controller("SelectTownController", function ($scope, $window, TownTree) {

  $scope.query = {
    state: null,
    district: null,
    town: null
  };

  $scope.states = TownTree.states;

  $scope.isQueryComplete = function () {
    return $scope.query.state && $scope.query.district && $scope.query.town;
  };

  $scope.GoToReport = function () {
    $window.location.href = "/reports.html";
  };

})

.controller("ReportTableController", function($scope, ReportsLoader, ReportConverter, PrepareHighChartData) {
  $scope.data = {
    tableAll: null,
    tableParties: null
  };

  $scope.charts = {
    parties: null,
    deputates: null
  };

  ReportsLoader.loadReport(onReport);

  function onReport(data) {
    $scope.data.tableAll = data;
    var parties = ReportConverter.GroupByParty(data);
    $scope.data.tableParties = parties;
    $scope.charts.parties = PrepareHighChartData.PartiesBarChart(parties);
    $scope.charts.deputates = PrepareHighChartData.DeputatesBarChart(data);
  }


});
