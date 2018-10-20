import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import { About } from "./components/about";
import { Footer } from "./components/footer";
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
            render={props => (
              <div>
                <SummonerSearch {...props} />
              </div>
            )}
          />
          <Route
            path="/about"
            render={() => (
              <div>
                <About /> <Footer />
              </div>
            )}
          />
          <Route
            path="/summoner/:name"
            render={props => <SummonerSearchResults {...props} />}
          />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById("main"));
