var express = require('express');
var lessMiddleware = require('less-middleware');
var app = express();

ENV = 'dev';
BASE_DIR = __dirname;
require('./core/config');

require(DIR_LIB + 'calculation');
//spawner = require('child_process');
//require('./scripts/scraper.js');

db.open(function () {
    require(DIR_LIB + 'Session');
    console.log('database connected');
	/*u.getDates(function(results, weeks) { 
		BACKTEST_DATE = results[results.length - 1];
	}, -1);*/
});

//init routes
var routes = require('./core/routes');
routes.forEach(function (route) {
    console.log('Initializing controller at path', route.path);
    app.use(route.path, (new route.controller()).getRouter());
});

//init static pages - COMMENT OUT WHEN BEHIND NGINX SERVER

app.use('/dist', express.static('dist'));

app.use('/app', lessMiddleware('app', { 
    preprocess: { 
        importPaths: function(paths, req) { return '/'; } 
    }
}));

app.use('/home', express.static('home'));
app.use('/css', lessMiddleware('css'));
app.use('/view', express.static('view'));
app.use('/js', express.static('js'));
app.use('/app', express.static('app'));
app.use('/app-design', express.static('app-design'));
app.use('/node_modules', express.static('node_modules'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

// init server
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('BackLive listening at http://%s:%s', host, port);
});