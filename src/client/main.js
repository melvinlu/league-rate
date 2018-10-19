import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import { About } from "./components/about";
import { Navbar } from "./components/navbar";
import { SummonerSearch } from "./components/summoner-search";
import { SummonerSearchResults } from "./components/summoner-search-results";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Route
            exact
            path="/"
            render={props => <SummonerSearch {...props} />}
          />
          <Route path="/about" render={() => <About />} />
          <Route
            path="/summoner/:id"
            render={props => <SummonerSearchResults {...props} />}
          />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById("main"));
