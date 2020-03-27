var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var gameRouter = require('./routes/game');
var menuProgrammingRouter = require('./routes/menu-programming');
var programmingRouter = require('./routes/programming');
var menuTutorialRouter = require('./routes/menu-tutorial');
var tutorialRouter = require('./routes/tutorial');
var menuWatchingRouter = require('./routes/menu-watching');
var watchingRouter = require('./routes/watching');

var app = express();


//socket.io
app.io = programmingRouter.io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/programming', gameRouter);
app.use('/menu-programming', menuProgrammingRouter);
app.use('/programming', programmingRouter);
app.use('/menu-tutorial', menuTutorialRouter);
app.use('/tutorial', tutorialRouter);
app.use('/menu-watching',menuWatchingRouter);
app.use('/watching',watchingRouter);


//API
app.get('/api/bgm', (req, res) => {
  const bgm_list = fs.readdirSync(path.join(__dirname, "public", "sound"));
  res.json(bgm_list);
});

app.get('/api/game', (req, res) => {
  const servar_data = JSON.parse(fs.readFileSync(path.join(__dirname, "load_data", "game_server_data", "server_data.json"), 'utf8'));
  res.json(servar_data);
});

app.get('/api/tutorial', (req, res) => {
  const stage_data = JSON.parse(fs.readFileSync(path.join(__dirname, "load_data", "tutorial_stage_data", "stage_data.json"), 'utf8'));
  res.json(stage_data);
});

app.get('/api/join', (req, res) => {
  const game_server = JSON.parse(fs.readFileSync(path.join(__dirname, "load_data", "game_server_data", "server_data.json"), 'utf8'));
  var join_list = [];
  Object.keys(game_server).forEach(function(key) {
    join_list.push([game_server[key].name,key]);
  });
  res.json(join_list);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
