let api_key = process.env.API_KEY;
let superagent = require("superagent");

const CURRENT_SEASON = 13;

let getStatsForSummoner = summonerName => {
  return getOverallInfo(summonerName)
    .then(data => {
      let name = data.name; // registered name of summoner
      let stats = data.rankedStats;

      return getRecentInfo(data.accountId)
        .then(data => {
          // send recent game info if available
          return stats
            ? {
                name: name,
                tier: stats.tier,
                rank: stats.rank,
                points: stats.leaguePoints,
                wins: stats.wins,
                losses: stats.losses,
                recentMatches: data
              }
            : {
                name: name,
                recentMatches: data
              };
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

let getOverallInfo = summonerName => {
  let url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`;

  return superagent
    .get(url)
    .then(data => {
      let name = data.body.name;
      let accountId = data.body.accountId;
      let url = `https://na1.api.riotgames.com/lol/league/v4/positions/by-summoner/${
        data.body.id
      }?api_key=${api_key}`;

      return superagent
        .get(url)
        .then(data => {
          let rankedStats = data.body.find(
            stats => stats.queueType === "RANKED_SOLO_5x5"
          );
          return {
            name: name,
            accountId: accountId,
            rankedStats: rankedStats
          };
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

let requestMatchInfo = (accountId, matchId) => {
  let url = `https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${api_key}`;
  return superagent
    .get(url)
    .then(data => {
      let stats = data.body;
      let playerId = stats.participantIdentities.find(
        id =>
          id.player.currentAccountId === accountId ||
          id.player.accountId === accountId
      );
      let id = playerId.participantId - 1;
      return stats.participants[id].stats.win;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

let getRecentInfo = accountId => {
  let url = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&api_key=${api_key}`;

  return superagent
    .get(url)
    .then(data => {
      let recentMatches = data.body.matches.slice(0, 10);
      let recentMatchIds = [];
      recentMatches.forEach(recentMatch => {
        if (recentMatch.season === CURRENT_SEASON) {
          recentMatchIds.push(recentMatch.gameId);
        }
      });
      return Promise.all(
        recentMatchIds.map(recentMatchId =>
          requestMatchInfo(accountId, recentMatchId)
        )
      );
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

let getInGameStatus = summonerName => {
  let url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`;

  return superagent
    .get(url)
    .then(data => {
      let url = `https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${
        data.body.id
      }?api_key=${api_key}`;

      return superagent
        .get(url)
        .then(data => {
          let inRankedGame = data.body.gameQueueConfigId === 420;
          let summoners = data.body.participants.map(participant => ({
            summonerName: participant.summonerName,
            team: participant.teamId
          }));
          return {
            inRankedGame: inRankedGame,
            participants: summoners
          };
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  getStatsForSummoner: getStatsForSummoner,
  getInGameStatus: getInGameStatus
};
