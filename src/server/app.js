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
  statsHelper
    .getOverallInfo(req.params.name)
    .then(data => {
      let name = data.name;
      let stats = data.rankedStats;

      statsHelper
        .getRecentInfo(data.accountId)
        .then(data => {
          if (stats) {
            res.send({
              name: name,
              tier: stats.tier,
              rank: stats.rank,
              points: stats.leaguePoints,
              wins: stats.wins,
              losses: stats.losses
            });
          } else {
            res.send({
              name: name
            });
          }
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
