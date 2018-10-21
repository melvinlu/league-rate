require("dotenv").config();

let express = require("express"),
  app = express(),
  path = require("path"),
  superagent = require("superagent"),
  port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "../../public")));

app.engine("pug", require("pug").__express);
app.set("views", __dirname);

let statsHelper = require("./stats.js");

// API
app.get("/search/:name", (req, res) => {
  let summonerName = req.params.name;

  statsHelper
    .getOverallInfo(summonerName)
    .then(data => {
      let name = data.name; // registered name of summoner
      let stats = data.rankedStats;

      statsHelper
        .getRecentInfo(data.accountId)
        .then(data => {
          // send recent game info if available
          let dataToSend = stats
            ? {
                name: name,
                tier: stats.tier,
                rank: stats.rank,
                points: stats.leaguePoints,
                wins: stats.wins,
                losses: stats.losses,
                recentMatches: data
              }
            : { name: name };
          res.send(dataToSend);
        })
        .catch(err => {
          console.log(`Error!: ${err}`);
          res.send({
            name: summonerName
          });
        });
    })
    .catch(err => {
      console.log(`Error!: ${err}`);
      res.send({
        name: summonerName
      });
    });
});

// SPA
app.get("*", (req, res) => {
  res.render("base.pug", {});
});

app.listen(port, () => console.log(`Running server on port ${port}`));
