var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/zvit', function(req, res) {
  var zvit = ["11","22", "33"];
  res.json(zvit);
});

module.exports = router;