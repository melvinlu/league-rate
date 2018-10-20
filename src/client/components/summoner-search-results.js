import LoadingAnimation from "./loading-animation";
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

const StatsRow = ({ name, tier, rank, points, wins, losses }) => {
  let ratio = Math.round((wins / (wins + losses)) * 100);
  let lowercaseTier = tier[0] + tier.slice(1).toLowerCase();
  let profileImgSrc = `http://avatar.leagueoflegends.com/na1/${name}.png`;
  let rankColor = rankToColor[lowercaseTier];

  return (
    <tr className="text-center">
      <td style={{ height: "75px" }}>
        <img src={profileImgSrc} style={{ height: "100%" }} /> {name}
      </td>
      <td>
        <span style={{ color: rankColor }}>
          {lowercaseTier} {rank}
        </span>{" "}
        <br />
        <small>{points} pts</small>
      </td>
      <td>Placeholder</td>
      <td>
        <span style={{ color: "green" }}>{wins}W</span> /{" "}
        <span style={{ color: "red" }}>{losses}L </span>({ratio}%)
      </td>
    </tr>
  );
};

const StatsTable = ({ name, tier, rank, points, wins, losses }) => {
  return (
    <div className="row">
      <div className="table-responsive">
        <table className="table mt-5">
          <thead className="thead">
            <tr className="bg-light text-center">
              <th scope="col">Summoner</th>
              <th scope="col">Rank</th>
              <th scope="col">Recent</th>
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
      loaded: false
    };
  }

  componentDidMount() {
    $.ajax({
      url: `/search/${this.state.summonerName}`,
      method: "get",
      success: data => {
        this.setState({
          tier: data.tier ? data.tier : "Unranked",
          rank: data.rank ? data.rank : "",
          points: data.points ? data.points : "",
          wins: data.wins ? data.wins : "",
          losses: data.losses ? data.losses : "",
          loaded: true
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.loaded ? (
          <StatsTable
            name={this.state.summonerName}
            tier={this.state.tier}
            rank={this.state.rank}
            points={this.state.points}
            wins={this.state.wins}
            losses={this.state.losses}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
    );
  }
}
