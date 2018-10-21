import React, { Component } from "react";

export class LoadingAnimation extends Component {
  render() {
    return (
      <div>
        <div className="row h-100 align-items-center">
          <div className="col">
            <h4 className="lead text-center">
              Entering the Fields of Justice...
            </h4>
            <div className="progress mx-auto" style={{ width: "50%" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
