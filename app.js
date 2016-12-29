var express = require('express');
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    request = require('request-promise'),
    port = process.env.PORT || 5000;

var API_KEY = 'b21a2bfa-331f-451c-aaa9-f27d08153e87'; // TODO: hide

server.listen(port, function() {
    console.log("Listening on port " + port + '.');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    socket.on('Calculate Rates', function (summoners) {
        var url = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' +
                summoners.join() +
                '?api_key=' +
                API_KEY,
            summonerIds = [];
        request(url)
            .then(function(response) {
                var summonerData = JSON.parse(response);
                var keys = Object.keys(summonerData);
                keys.forEach(function(key, index) {
                    summonerIds.push(keys.map(key => summonerData[key])[index].id);
                });
                calculateWinRates(summonerIds, socket);
            })
            .catch(function(err) {
                console.log(err);
            });
    });
});

function calculateWinRates(summonerIds, socket) {
    var summonerWRs = [],
        baseUrl = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/',
        url,
        recentData,
        gameCount,
        wins;

    var promises = summonerIds.map(function(summonerId, index) {
        url = baseUrl + summonerId + '/recent?api_key=' + API_KEY;
        return request(url)
            .then(function(response) {
                wins = 0;
                recentData = JSON.parse(response);
                gameCount = 10;
                for (var i = 0; i < gameCount; ++i) {
                    if (recentData.games[i].stats.win) {
                        ++wins;
                    }
                }
                summonerWRs.push({id: index, WR: wins / gameCount * 100});
            })
            .catch(function(err) {
                console.log(err);
            });
        });
    return Promise.all(promises).then(function(data) {
        socket.emit('Calculated Rates', summonerWRs);
        return undefined;
    });
}
