import React, { Component } from "react";

export class StatsHeader extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <h4 className="mx-auto text-center mt-5">
            Summoner Stats (NA Ranked)
          </h4>
        </div>
        <hr className="divider mt-2 mx-5" />
      </div>
    );
  }
}
