// Declare modules to use
require('dotenv').config();
var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 5000,
    Summoners = require('./summoners.js'),
    Calculator = require('./calculator.js');

// Allow the server to listen to the provided port
server.listen(port, function() {
    console.log("Listening on port " + port + '.');
});

// Serve only the static content of the website
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io functions
io.on('connection', function (socket) {
    // Function to calculate the ranked stats of each summoner
    socket.on('Calculate Stats', function (names) {
        var summoners = new Summoners(names);
        var namePromise = Promise.resolve(Summoners.getSummonerIds(summoners, socket));
        namePromise.then(function() {
            var promises = [
                Promise.resolve(Calculator.calculateRecentStats(summoners)),
                Promise.resolve(Calculator.calculateSeasonRates(summoners))
            ];
            Promise.all(promises).then(function() {
                    socket.emit(
                        'Calculated Stats', summoners.WRs, summoners.seasonWRs, summoners.streaks
                    );
                }).catch(function(error) {
                    console.log(error)
                });
        });
    });
});
