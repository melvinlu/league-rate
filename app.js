// TODO:
// * Minify files
// * Implement caching
// * Implement rate limit avoiding mechanism
// * Implement error handling mechanism
// * Allow 'enter' for submission (add event listener)
// * Hide API key

// Declare modules to use
var express = require('express'),
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
    // Function to calculate the ranked stats of each summoner
    socket.on('Calculate Stats', function (summoners) {
        url = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' +
                summoners.join() +
                '?api_key=' +
                API_KEY,
            summonerIdsMap = new Map(),
            summonerIdsArr = [];
        // Poll for the ID of each summoner
        request({url, resolveWithFullResponse: true})
            .then(function(response) {
                var summonerData = JSON.parse(response.body);
                var keys = Object.keys(summonerData);;
                keys.forEach(function(key, index) {
                    summonerIdsMap.set(key, summonerData[key].id);
                    summonerIdsArr.push(summonerData[key].id);
                });
                calculateRecentStats(summonerIdsMap, summonerIdsArr, summoners, socket);
            })
            .catch(function(err) {
                socket.emit('Calculated Stats', [], [], []);
                return;
            });
    });
});

function calculateRecentStats(summonerIdsMap, summonerIdsArr, summoners, socket) {
    var summonerWRs = [],
        summonerRates = new Map(),
        summonerStrks = [],
        summonerStreaks = new Map(),
        baseUrl = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/',
        aggregateWins = 0,
        aggregateGames = 0;

    // Queue the promise of each request
    var promises = summonerIdsArr.map(function(summonerId) {
        url = baseUrl + summonerId + '/recent?api_key=' + API_KEY;
        return request(url)
            .then(function(response) {
                var wins = 0;
                var currentStreak = 0;
                var rankedGames = 0;
                var streakSet = false;
                var recentData = JSON.parse(response);
                var gameCount = recentData.games.length;
                for (var i = 0; i < gameCount; ++i) {
                    if (recentData.games[i].subType == 'RANKED_SOLO_5x5') {
                        ++rankedGames;
                        ++aggregateGames;
                        if (!currentStreak) {
                            currentStreak = (recentData.games[i].stats.win) ? 1 : -1;
                        }
                        if (recentData.games[i].stats.win) {
                            ++wins;
                            ++aggregateWins;
                            if (!streakSet && currentStreak > 0) {
                                if (i) ++currentStreak;
                            } else {
                                streakSet = true;
                            }
                        } else {
                            if (!streakSet && currentStreak < 0) {
                                if (i) --currentStreak;
                            } else {
                                streakSet = true;
                            }
                        }
                    }
                }
                summonerRates.set(summonerId, Math.round(wins / rankedGames * 100));
                summonerStreaks.set(summonerId, currentStreak);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

    // Properly reorder and return the win rate of each summoner
    return Promise.all(promises)
        .then(function(data) {
            for (var i = 0; i < summoners.length; ++i) {
                summonerWRs.push(summonerRates.get(summonerIdsMap.get(summoners[i])));
                summonerStrks.push(summonerStreaks.get(summonerIdsMap.get(summoners[i])));
            }
            summonerWRs.push(Math.round(aggregateWins / aggregateGames * 100));
            // Now calculate all win rates for each summoner
            calculateSeasonRates(summonerIdsMap, summonerIdsArr, summoners, summonerWRs,
                                summonerStrks, socket);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function calculateSeasonRates(summonerIdsMap, summonerIdsArr, summoners,
    summonerWRs, summonerStrks, socket) {
    var summonerSeasonWRs= [],
        summonerSeasonRates = new Map(),
        baseUrl = 'https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/',
        aggregateWins = 0,
        aggregateGames = 0;

    // Queue the promise of each request
    var promises = summonerIdsArr.map(function(summonerId) {
        url = baseUrl + summonerId + '/summary?api_key=' + API_KEY;
        return request(url)
            .then(function(response) {
                var summonerStats = JSON.parse(response);
                var rankedIndex;
                summonerStats.playerStatSummaries.forEach(function(summary, index) {
                    if (summary.playerStatSummaryType == 'RankedSolo5x5') {
                        rankedIndex = index;
                    }
                });
                var wins = summonerStats.playerStatSummaries[rankedIndex].wins;
                aggregateWins += wins;
                var games = wins + summonerStats.playerStatSummaries[rankedIndex].losses;
                aggregateGames += games;
                if (games == 0) {
                    summonerSeasonRates.set(summonerId, 0);
                } else {
                    summonerSeasonRates.set(summonerId, Math.round(wins / games * 100));
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        });

    // Properly reorder and return the season win rate of each summoner
    return Promise.all(promises)
        .then(function(data) {
            for (var i = 0; i < summoners.length; ++i) {
                summonerSeasonWRs.push(summonerSeasonRates.get(summonerIdsMap.get(summoners[i])));
            }
            if (!aggregateGames) {
                summonerSeasonWRs.push(0);
            } else {
                summonerSeasonWRs.push(Math.round(aggregateWins / aggregateGames * 100));
            }
            socket.emit('Calculated Stats', summonerWRs, summonerSeasonWRs, summonerStrks);
        })
        .catch(function(err) {
            console.log(err);
        });
}
