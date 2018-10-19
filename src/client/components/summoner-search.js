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
        <div className="row mt-5">
          <div className="col-12 col-md-10 col-lg-8 ml-auto mr-auto">
            <form className="card card-sm">
              <div className="card-body row no-gutters align-items-center">
                <div className="col mr-2">
                  <input
                    className="form-control form-control-lg form-control-borderless"
                    type="search"
                    placeholder="Summoner Name"
                    onChange={this.handleInput}
                  />
                </div>
                <div className="col-auto">
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
