require("dotenv").config();

let express = require("express"),
  app = express(),
  path = require("path"),
  superagent = require("superagent"),
  port = process.env.PORT || 8080,
  api_key = process.env.API_KEY;

app.use(express.static(path.join(__dirname, "../../public")));

app.engine("pug", require("pug").__express);
app.set("views", __dirname);

// API
app.get("/search/:id", (req, res) => {
  let summonerId = req.params.id;
  let url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerId}?api_key=${api_key}`;

  superagent
    .get(url)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(`Error!: ${err}`);
    });
});

// SPA
app.get("*", (req, res) => {
  res.render("base.pug", {});
});

app.listen(port, () => console.log(`Running server on port ${port}`));
