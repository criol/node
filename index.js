var express = require('express'),
    path = require('path'),
    curl = require('curlrequest'),
    flightInfoAction = require('./actions/flightInfoActions')(
        'flightstats.com/go/FlightStatus/flightStatusByFlight.do?airline=&flightNumber={flightNumber}&departureDate={departureDate}',
        new RegExp('<table class="statusDetailsTable">(.*?)<\/table>', 'gmi')
    ),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length;



var router = express.Router();

var app = express();



app.set('views', './web/views');
app.set('view engine', 'twig');


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
});



router.use(function(req, res, next) {
    console.log(req.method, req.url);

    next();
});


router.get('/', function(req, res){
    res.render('index', {
        body : "Hello World"
    });
});

router.get('/flights/:flightNumber/:departureDate', function (req, res) {
    var fl = req.params.flightNumber,
        dd = req.params.departureDate;

    flightInfoAction.getFlightInfo(fl, dd, function (result) {
        res.send(result)
    });
});

app.use(express.static('./web'));

app.use('/', router);

var port = process.env.PORT || 5000;

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    app.listen(port, function() {
        console.log('Listening on port %d', port);
    });
}
