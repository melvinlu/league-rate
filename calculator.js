"use strict";

var API_KEY = process.env.API_KEY,
    request = require('request-promise'),
    Stats = require('./stats.js');

module.exports = class Calculator {

    static calculateRecentStats(summoners) {
        var rs = new Stats('recent');
        // Queue the promise of each request
        var promises = summoners.arr.map(function(summonerId) {
            var url = rs.baseUrl + summonerId + '/recent?api_key=' + API_KEY;
            return request(url)
                .then(function(response) {
                    // Helper function
                    countGames(response, rs, summonerId);
                })
                .catch(function(error) {
                    console.log(error);
                });
            });

        // Properly reorder and match the win rate of each summoner
        return Promise.all(promises)
            .then(function(data) {
                for (var i = 0; i < summoners.names.length; ++i) {
                    summoners.WRs.push(
                        rs.summonerRates.get(summoners.map.get(summoners.names[i]))
                    );
                    summoners.streaks.push(
                        rs.summonerStreaks.get(summoners.map.get(summoners.names[i]))
                    );
                }
                summoners.WRs.push(Math.round(rs.aggregateWins / rs.aggregateGames * 100));
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    static calculateSeasonRates(summoners) {
        var ss = new Stats('season');
        // Queue the promise of each request
        var promises = summoners.arr.map(function(summonerId) {
            var url = ss.baseUrl + summonerId + '/summary?season=SEASON2017&api_key=' + API_KEY;
            return request(url).then(function(response) {
                    var summonerStats = JSON.parse(response);
                    summonerStats.playerStatSummaries.forEach(function(summary, index) {
                        if (summary.playerStatSummaryType == 'RankedSolo5x5') {
                            ss.rankedIndex = index;
                        }
                    });
                    ss.wins = summonerStats.playerStatSummaries[ss.rankedIndex].wins;
                    ss.aggregateWins += ss.wins;
                    ss.games = ss.wins + summonerStats.playerStatSummaries[ss.rankedIndex].losses;
                    ss.aggregateGames += ss.games;
                    if (ss.games == 0) {
                        ss.summonerRates.set(summonerId, 0);
                    } else {
                        ss.summonerRates.set(summonerId, Math.round(ss.wins / ss.games * 100));
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            });

        // Properly reorder and match the season win rate of each summoner
        return Promise.all(promises).then(function(data) {
                for (var i = 0; i < summoners.names.length; ++i) {
                    summoners.seasonWRs.push(
                        ss.summonerRates.get(summoners.map.get(summoners.names[i]))
                    );
                }
                if (ss.aggregateGames) {
                    summoners.seasonWRs.push(Math.round(ss.aggregateWins / ss.aggregateGames * 100));
                } else {
                    summoners.seasonWRs.push(0);
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
};

function countGames(response, rs, summonerId) {
    var recentData = JSON.parse(response);
    var gameCount = recentData.games.length;
    // Algorithm to count games & wins
    for (var i = 0; i < gameCount; ++i) {
        if (recentData.games[i].subType == 'RANKED_SOLO_5x5') {
            ++rs.rankedGames;
            ++rs.aggregateGames;
            if (!rs.currentStreak) {
                rs.currentStreak = (recentData.games[i].stats.win) ? 1 : -1;
            }
            if (recentData.games[i].stats.win) {
                ++rs.wins;
                ++rs.aggregateWins;
                if (!rs.streakSet && rs.currentStreak > 0) {
                    if (i) ++rs.currentStreak;
                } else {
                    rs.streakSet = true;
                }
            } else {
                if (!rs.streakSet && rs.currentStreak < 0) {
                    if (i) --rs.currentStreak;
                } else {
                    rs.streakSet = true;
                }
            }
        }
    }
    rs.summonerRates.set(summonerId, Math.round(rs.wins / rs.rankedGames * 100));
    rs.summonerStreaks.set(summonerId, rs.currentStreak);
}
