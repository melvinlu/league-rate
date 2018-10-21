import React, { Component } from "react";

export class About extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <h1 className="mx-auto text-center display-4 mt-5">About</h1>
        </div>
        <div className="row">
          <p className="lead mx-auto text-center">
            LolJudge provides a simple and fast way to analyze and predict
            ranked (solo/duo) performance of summoners.
          </p>
        </div>
      </div>
    );
  }
}
