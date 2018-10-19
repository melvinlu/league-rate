"use strict";

module.exports = class Stats {
  constructor(type) {
    this.summonerRates = new Map();
    this.summonerStreaks = new Map();
    this.aggregateWins = 0;
    this.aggregateGames = 0;
    this.wins = 0;
    this.games = 0;
    this.currentStreak = 0;
    this.rankedGames = 0;
    this.streakSet = false;
    this.streakStart = 0;
    this.rankedIndex = 0;
    if (type == "recent") {
      this.baseUrl = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/";
    }
    if (type == "season") {
      this.baseUrl =
        "https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/";
    }
  }
};
