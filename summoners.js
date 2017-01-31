"use strict";

var API_KEY = process.env.API_KEY,
    request = require('request-promise');

module.exports = class Summoners {

    constructor(summoners) {
        this.names = summoners;
        this.map = new Map();
        this.arr = [];
        this.WRs = [];
        this.streaks = [];
        this.seasonWRs = [];
    }

    static getSummonerIds(summoners, socket) {
        var url = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' +
                summoners.names.join() + '?api_key=' + API_KEY;
        // Poll for the ID of each summoner
        return request({url, resolveWithFullResponse: true})
            .then(function(response) {
                var summonerData = JSON.parse(response.body);
                var keys = Object.keys(summonerData);
                keys.forEach(function(key, index) {
                    summoners.map.set(key, summonerData[key].id);
                    summoners.arr.push(summonerData[key].id);
                });
            })
            // Something went wrong!...
            .catch(function(error) {
                socket.emit('Calculated Stats', [], [], []);
            });
        }
};
