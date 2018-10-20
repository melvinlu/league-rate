import React, { Component } from "react";

export class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand ml-2" href="/">
            LolJudge
          </a>
          <ul className="navbar-nav ml-auto">
            <a className="navbar-brand" href="/about">
              About
            </a>
          </ul>
        </nav>
      </div>
    );
  }
}
