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
  let summonerName = encodeURI(req.params.name);

  statsHelper
    .getStatsForSummoner(summonerName)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get("/ingame/:name", (req, res) => {
  let summonerName = encodeURI(req.params.name);

  statsHelper
    .getInGameStatus(summonerName)
    .then(data => {
      if (data.inRankedGame) {
        let teamIds = data.participants.map(participant => participant.team);
        Promise.all(
          data.participants.map(participant =>
            statsHelper.getStatsForSummoner(encodeURI(participant.summonerName))
          )
        )
          .then(data => {
            res.send({
              inRankedGame: true,
              teamStats: data,
              teamIds: teamIds
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).send(err);
          });
      } else {
        res.send({ inRankedGame: false });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

// SPA
app.get("*", (req, res) => {
  res.render("base.pug", {});
});

app.listen(port, () => console.log(`Running server on port ${port}`));
