var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);




chartData = {
  logCount: 0,
  logTimeLabels: [],
  videoUrlList: [],

  videoInfoList: {

  }
}

var fs = require('fs');
if (fs.existsSync("/home/LogFiles/log.json")) {
  var t = fs.readFileSync("/home/LogFiles/log.json");
  chartData = JSON.parse(t);
  console.log(t);
}

var fetchVideoInfo = require('youtube-info');
var request = require('request');

var bot = function () {
  try {
    request.get('https://eoshackathon.io/community-voting/', function (err, response, body) {
      chartData.logTimeLabels.push(Date.now());
      console.log("---------" + Date.now() + "----------");
      var l = body.split("https://www.youtube.com/embed/");
      for (i = 1; i < l.length; i++) {
        s = l[i].split('"', 1);
        if (chartData.videoUrlList.indexOf(s[0]) < 0) {
          chartData.videoUrlList.push(s[0]);
          chartData.videoInfoList[s[0]] = {
            likes: [],
            dislikes: [],
            views: [],
            comments: [],
            owner: "",
            thumbnailUrl: "",
            datePublished: "",
          }
          for (j = 0; j < chartData.logCount; j++) {
            chartData.videoInfoList[s[0]].likes.push(0);
            chartData.videoInfoList[s[0]].dislikes.push(0);
            chartData.videoInfoList[s[0]].views.push(0);
            chartData.videoInfoList[s[0]].comments.push(0);

          }
        }
      };

      var list = chartData.videoUrlList;

      getVideoInfo(list, 0);
      chartData.logCount++;
    });

    var getVideoInfo = function (list, i) {
      fetchVideoInfo(list[i]).then(function (videoInfo) {
        chartData.videoInfoList[list[i]].owner = videoInfo.title + "/" + videoInfo.owner;
        chartData.videoInfoList[list[i]].thumbnailUrl = videoInfo.thumbnailUrl;
        chartData.videoInfoList[list[i]].datePublished = videoInfo.datePublished;
        chartData.videoInfoList[list[i]].likes.push(videoInfo.likeCount);
        chartData.videoInfoList[list[i]].dislikes.push(videoInfo.dislikeCount);
        chartData.videoInfoList[list[i]].views.push(videoInfo.views);
        chartData.videoInfoList[list[i]].comments.push(videoInfo.commentCount);

        i++;
        if (list.length <= i) {
          console.log("-----------------------------------------");
          fs.chmod("/home/LogFiles/log.json", 0777, (error) => {
            fs.writeFile("/home/LogFiles/log.json", JSON.stringify(chartData, null, 4), 'utf8', function () {
              console.log('Changed file permissions');
              bot();
            });
          });
          return;
        }
        else {
          console.log(chartData.videoInfoList[list[i - 1]]);
          getVideoInfo(list, i);
        }
      }).catch(function (e) {
        bot();
      });
    }
  }
  catch (e) {
    bot();
  }


}

bot();






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
