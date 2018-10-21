import { LoadingAnimation } from "./loading-animation";
import { StatsHeader } from "./stats-header";
import React, { Component } from "react";
import $ from "jquery";

let rankToColor = {
  Bronze: "#cd7f32",
  Silver: "#c0c0c0",
  Gold: "#d4af37",
  Platinum: "#008080",
  Diamond: "#b9f2ff",
  Master: "#808080",
  Challenger: "#996515"
};

let WinsText = ({ wins }) => <span style={{ color: "green" }}>{wins}W</span>;

let LossesText = ({ losses }) => (
  <span style={{ color: "red" }}>{losses}L</span>
);

let RecentGameInfo = recentMatches => {
  let matches = recentMatches.recentMatches;
  if (!matches) {
    return "";
  }

  let lastMatchResult = matches[0];
  let streakEnd = false;
  let streakGames = 0;
  let wins = 0;

  matches.forEach(match => {
    if (match) {
      ++wins;
    }
    if (!streakEnd && match === lastMatchResult) {
      streakGames += match ? 1 : -1;
    }
    if (match !== lastMatchResult) {
      streakEnd = true;
    }
  });
  let losses = matches.length - wins;
  let recentRatio = Math.round((wins / matches.length) * 100);

  let streakColor =
    streakGames > 0 ? "green" : streakGames === 0 ? "black" : "red";

  let streakPrefix = streakGames > 0 ? "+" : ""; // - already included;

  return (
    <div>
      <WinsText wins={wins} /> / <LossesText losses={losses} />
      <br />({recentRatio}%)
      <br />
      <small>
        Streak:{" "}
        <span style={{ color: streakColor }}>
          {streakPrefix}
          {streakGames}
        </span>
      </small>
    </div>
  );
};

let StatsRow = ({ name, tier, rank, points, wins, losses, recentMatches }) => {
  if (!tier) {
    tier = "Unranked";
  }
  let ratio =
    tier !== "Unranked" ? Math.round((wins / (wins + losses)) * 100) : "";
  let lowercaseTier = tier[0] + tier.slice(1).toLowerCase();
  let profileImgSrc = `http://avatar.leagueoflegends.com/na1/${name}.png`;
  let pointsText = tier !== "Unranked" ? points + " pts" : "";

  return (
    <tr className=" text-center">
      <td style={{ height: "75px" }}>
        <img src={profileImgSrc} style={{ height: "100%" }} />
        <br /> {name}
      </td>
      <td>
        <span style={{ color: rankToColor[lowercaseTier] }}>
          {lowercaseTier} {rank}
        </span>{" "}
        <br />
        <small>{pointsText}</small>
      </td>
      <td>
        <RecentGameInfo recentMatches={recentMatches} />
      </td>
      <td>
        {/* For players who are unranked but have played some provisionals */}
        {tier === "Unranked" ? (
          <RecentGameInfo recentMatches={recentMatches} />
        ) : (
          <div>
            {" "}
            <WinsText wins={wins} /> / <LossesText losses={losses} />
            <br />({ratio}%)
          </div>
        )}
      </td>
    </tr>
  );
};

let StatsTable = ({ stats }) => {
  let statsRows = stats.map(stat => (
    <StatsRow
      name={stat.name}
      tier={stat.tier}
      rank={stat.rank}
      points={stat.points}
      wins={stat.wins}
      losses={stat.losses}
      recentMatches={stat.recentMatches}
      key={stat.name}
    />
  ));
  return (
    <div className="row">
      <div className="col-10 offset-1">
        <div className="table-responsive">
          <table className="table table-sm mt-5">
            <thead className="thead text-center">
              <tr className="bg-light">
                <th scope="col">Summoner</th>
                <th scope="col">Rank</th>
                <th scope="col">Past 10</th>
                <th scope="col">Overall</th>
              </tr>
            </thead>
            <tbody>{statsRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

class InGameStats extends Component {
  render() {
    let blueTeamStats = [],
      redTeamStats = [];
    if (this.props.inRankedGame) {
      let blueIds = [],
        redIds = [];
      this.props.teamIds.forEach((teamId, index) => {
        if (teamId === 100) {
          blueIds.push(index);
        } else {
          redIds.push(index);
        }
      });
      this.props.teamStats.forEach((teamStat, index) => {
        if (blueIds.includes(index)) {
          blueTeamStats.push(teamStat);
        } else {
          redTeamStats.push(teamStat);
        }
      });
    }

    return (
      <div>
        <div className="row">
          <h4 className="mx-auto text-center mt-2">Now Playing</h4>
        </div>
        <hr className="divider mx-5" />
        {this.props.inRankedGame ? (
          <div className="row">
            <div className="col-xs-12 col-lg-6">
              <p className="text-center mb-0" style={{ color: "blue" }}>
                Blue Team
              </p>
              <StatsTable stats={blueTeamStats} />
            </div>
            <div className="col-xs-12 col-lg-6">
              <p className="text-center mb-0" style={{ color: "red" }}>
                Red Team
              </p>
              <StatsTable stats={redTeamStats} />
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-10 offset-1">
              <p className="text-center">
                Looks like {this.props.name} is currently not in a ranked game.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export class SummonerSearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerName: this.props.match.params.name,
      tier: "Unranked",
      rank: "",
      points: 0,
      wins: 0,
      losses: 0,
      recentMatches: "",
      profileLoaded: false,
      inRankedGame: false,
      teamStats: "",
      teamIds: "",
      inGameStatusLoaded: false
    };
  }

  componentDidMount() {
    // Fetch profile
    $.ajax({
      url: `/search/${this.state.summonerName}`,
      method: "get",
      success: data => {
        this.setState({
          summonerName: data.name,
          tier: data.tier ? data.tier : "Unranked",
          rank: data.rank ? data.rank : "",
          points: data.points,
          wins: data.wins,
          losses: data.losses,
          recentMatches: data.recentMatches,
          profileLoaded: true
        });
      },
      error: err => {
        this.setState({
          tier: "Unranked",
          profileLoaded: true
        });
      }
    });

    // Fetch in-game status
    $.ajax({
      url: `/ingame/${this.state.summonerName}`,
      method: "get",
      success: data => {
        this.setState({
          inRankedGame: data.inRankedGame,
          teamStats: data.teamStats,
          teamIds: data.teamIds,
          inGameStatusLoaded: true
        });
      },
      error: err => {
        this.setState({
          inGameStatusLoaded: true
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.profileLoaded && this.state.inGameStatusLoaded ? (
          <div>
            <StatsHeader />
            {/* Searched summoner profile */}
            <StatsTable
              stats={[
                {
                  name: this.state.summonerName,
                  tier: this.state.tier,
                  rank: this.state.rank,
                  points: this.state.points,
                  wins: this.state.wins,
                  losses: this.state.losses,
                  recentMatches: this.state.recentMatches
                }
              ]}
            />
            <InGameStats
              inRankedGame={this.state.inRankedGame}
              name={this.state.summonerName}
              teamStats={this.state.teamStats}
              teamIds={this.state.teamIds}
            />
          </div>
        ) : (
          <LoadingAnimation />
        )}
      </div>
    );
  }
}
