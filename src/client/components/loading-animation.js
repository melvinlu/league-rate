import React, { Component } from "react";

const LoadingAnimation = () => (
  <div>
    <div className="row h-100 align-items-center">
      <div className="col">
        <h4 className="lead text-center">Fetching data...</h4>
        <div className="progress mx-5">
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

export default LoadingAnimation;
