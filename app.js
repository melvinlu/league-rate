// TODO:
// Implement caching
// Implement rate limit avoiding mechanism
// Implement error handling mechanism
// Hide API key

// Declare modules to use
var express = require('express');
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    request = require('request-promise'),
    port = process.env.PORT || 5000;

var API_KEY = 'b21a2bfa-331f-451c-aaa9-f27d08153e87';

// Allow the server to listen to the provided port
server.listen(port, function() {
    console.log("Listening on port " + port + '.');
});

// Serve only the static content of the website
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io functions
io.on('connection', function (socket) {
    // Function to calculate the win rates of each summoner
    socket.on('Calculate Rates', function (summoners) {
        var url = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' +
                summoners.join() +
                '?api_key=' +
                API_KEY,
            summonerIdsMap = new Map(),
            summonerIdsArr = [];
        // Poll for the ID of each summoner
        request(url)
            .then(function(response) {
                var summonerData = JSON.parse(response);
                var keys = Object.keys(summonerData);;
                keys.forEach(function(key, index) {
                    summonerIdsMap.set(key, summonerData[key].id);
                    summonerIdsArr.push(summonerData[key].id);
                });
                calculateWinRates(summonerIdsMap, summonerIdsArr,
                    summoners, socket);
            })
            .catch(function(err) {
                console.log(err);
            });
    });
});

function calculateWinRates(summonerIdsMap, summonerIdsArr, summoners, socket) {
    var summonerWRs = [],
        summonerRates = new Map(),
        baseUrl = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/',
        url,
        recentData,
        gameCount,
        wins,
        aggregateWins = 0,
        aggregateGames = 0;

    // Queue the promise of each request
    var promises = summonerIdsArr.map(function(summonerId) {
        url = baseUrl + summonerId + '/recent?api_key=' + API_KEY;
        return request(url)
            .then(function(response) {
                wins = 0;
                recentData = JSON.parse(response);
                gameCount = recentData.games.length;
                for (var i = 0; i < gameCount; ++i, ++aggregateGames) {
                    if (recentData.games[i].stats.win) {
                        ++wins;
                        ++aggregateWins;
                    }
                }
                summonerRates.set(summonerId, wins / gameCount * 100);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

    // Properly reorder and return the win rate of each summoner
    return Promise.all(promises)
        .then(function(data) {
            for (var i = 0; i < summoners.length; ++i) {
                summonerWRs.push(
                    summonerRates.get(
                        summonerIdsMap.get(
                            summoners[i]))
                        );
            }
            summonerWRs.push(Math.round(aggregateWins / aggregateGames * 100));
            // Send the data back to the client
            socket.emit('Calculated Rates', summonerWRs);
        })
        .catch(function(err) {
            console.log(err);
        });
}
