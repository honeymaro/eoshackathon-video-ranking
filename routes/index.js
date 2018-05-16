var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
  var fs = require('fs');
  chartData = {};
  if (fs.existsSync("/home/LogFiles/log.json")) {
    var t = fs.readFileSync("/home/LogFiles/log.json");
    chartData = JSON.parse(t);
  }

  res.render('index', {
    chartData: chartData
  });
});

module.exports = router;
