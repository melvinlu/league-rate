import React, { Component } from "react";

export class SummonerSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerName: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleInput(event) {
    event.preventDefault();
    this.setState({ summonerName: event.currentTarget.value });
  }

  handleSearch(event) {
    event.preventDefault();
    this.props.history.push(`/summoner/${this.state.summonerName}`);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div
            className="card mx-auto mt-3 "
            style={{ height: "15rem", width: "65%" }}
          >
            <img className="card-img-top" src="images/banner.jpg" />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-md-10 col-lg-8 mx-auto">
            <form>
              <div className="row no-gutters">
                <div className="col mr-1 ml-2">
                  <input
                    className="form-control form-control-lg form-control-borderless"
                    type="search"
                    placeholder="Summoner Name"
                    onChange={this.handleInput}
                  />
                </div>
                <div className="col-auto mr-2 ml-1">
                  <button
                    className="btn btn-lg btn-primary"
                    type="submit"
                    onClick={this.handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
