let api_key = process.env.API_KEY;
let superagent = require("superagent");

let getOverallInfo = summonerName => {
  let url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${api_key}`;

  return superagent
    .get(url)
    .then(data => {
      let name = data.body.name;
      let accountId = data.body.accountId;
      let url = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${
        data.body.id
      }?api_key=${api_key}`;

      return superagent
        .get(url)
        .then(data => {
          console.log(data.body);
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
          return;
        });
    })
    .catch(err => {
      return;
    });
};

let requestMatchInfo = (accountId, matchId) => {
  let url = `https://na1.api.riotgames.com/lol/match/v3/matches/${matchId}?api_key=${api_key}`;
  return superagent
    .get(url)
    .then(data => {
      let stats = data.body;
      let playerId = stats.participantIdentities.find(
        id => id.player.accountId === accountId
      );
      let id = playerId.participantId - 1;
      return stats.participants[id].stats.win;
    })
    .catch(err => {
      return;
    });
};

let getRecentInfo = accountId => {
  let url = `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}?queue=420&api_key=${api_key}`;

  return superagent
    .get(url)
    .then(data => {
      let recentMatches = data.body.matches.slice(0, 10);
      let recentMatchIds = recentMatches.map(recentMatch => recentMatch.gameId);
      return Promise.all(
        recentMatchIds.map(recentMatchId =>
          requestMatchInfo(accountId, recentMatchId)
        )
      );
    })
    .catch(err => {
      return;
    });
};

module.exports = {
  getOverallInfo: getOverallInfo,
  getRecentInfo: getRecentInfo
};
