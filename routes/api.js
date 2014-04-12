var express = require('express');
var router = express.Router();


var csv = require('csv');
var fs = require('fs');



/* GET users listing. */
router.get('/zvit', function(req, res) {
  var rows = [];

  csv()
  .from.stream(fs.createReadStream(__dirname+'/../db/lvivska/truskavec/zvit.csv'))
  .to(function(data){ console.log(data) })
  .transform( function(row){
    // row.unshift(row.pop());
    return row;
  })
  .on('record', function(row,index){
    console.log('#'+index+' '+JSON.stringify(row));
    rows.push(row);
  })
  .on('end', function(count){
    console.log('Number of lines: '+count);
    //var rows = ["алібаба","джин", "лампа"];
    res.json(rows);
  })
  .on('error', function(error){
    console.log(error.message);
  });



});

module.exports = router;