import React, { Component } from "react";

export class About extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <h1 className="col-3 mx-auto text-center display-4 mt-5">About</h1>
        </div>
        <div className="row">
          <p className="lead mx-auto text-center">
            LolJudge provides a simple and fast way to analyze and predict a
            summoner's ranked performance.
          </p>
        </div>
        <hr className="mt-2 mb-4 mx-5" />
        <div className="row">
          <small className="mx-2 text-center">
            LoLJudge isn't endorsed by Riot Games and doesn't reflect the views
            or opinions of Riot Games or anyone officially involved in producing
            or managing League of Legends. League of Legends and Riot Games are
            trademarks or registered trademarks of Riot Games, Inc. League of
            Legends © Riot Games, Inc.
          </small>
        </div>
      </div>
    );
  }
}
