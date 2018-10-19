"use strict";

var API_KEY = process.env.API_KEY,
  request = require("request-promise");

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
    var url =
      "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/bluelu?api_key=RGAPI-a5aad056-b41b-4da4-8fc0-59ed9cb93833";
    // Poll for the ID of each summoner
    return (
      request({ url, resolveWithFullResponse: true })
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
          socket.emit("Calculated Stats", [], [], []);
        })
    );
  }
};
