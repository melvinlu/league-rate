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

const StatsRow = ({
  name,
  tier,
  rank,
  points,
  wins,
  losses,
  recentMatches
}) => {
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
        <WinsText wins={wins} /> / <LossesText losses={losses} />
        <br />({ratio}%)
      </td>
    </tr>
  );
};

const StatsTable = ({
  name,
  tier,
  rank,
  points,
  wins,
  losses,
  recentMatches
}) => {
  return (
    <div className="row">
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
          <tbody>
            <StatsRow
              name={name}
              tier={tier}
              rank={rank}
              points={points}
              wins={wins}
              losses={losses}
              recentMatches={recentMatches}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export class SummonerSearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerName: this.props.match.params.name,
      tier: "",
      rank: "",
      points: 0,
      wins: 0,
      losses: 0,
      recentMatches: "",
      loaded: false
    };
  }

  componentDidMount() {
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
          loaded: true
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.loaded ? (
          <div>
            <StatsHeader />
            <StatsTable
              name={this.state.summonerName}
              tier={this.state.tier}
              rank={this.state.rank}
              points={this.state.points}
              wins={this.state.wins}
              losses={this.state.losses}
              recentMatches={this.state.recentMatches}
            />
          </div>
        ) : (
          <LoadingAnimation />
        )}
      </div>
    );
  }
}
