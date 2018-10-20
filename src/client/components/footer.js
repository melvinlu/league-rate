import React, { Component } from "react";

export class Footer extends Component {
  render() {
    return (
      <div>
        <hr className="divider mt-2 mb-4 mx-5" />
        <div className="row">
          <small className="text-muted mx-4 text-center">
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
