import React, { Component } from "react";
import $ from "jquery";

class SummonerInfo extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <p className="lead mt-5 mx-auto text-center">
            Account Id: {this.props.accountId}
          </p>
        </div>
        <div className="row">
          <p className="lead mt-2 mx-auto text-center">
            Summoner Id: {this.props.summonerId}
          </p>
        </div>
      </div>
    );
  }
}

export class SummonerSearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summonerName: this.props.match.params.id,
      accountId: "",
      summonerId: "",
      loaded: false
    };
  }

  componentDidMount() {
    $.ajax({
      url: `/search/${this.state.summonerName}`,
      method: "get",
      success: data => {
        let summonerInfo = JSON.parse(data.text);
        this.setState({
          accountId: summonerInfo.accountId,
          summonerId: summonerInfo.id,
          loaded: true
        });
      },
      error: error => {}
    });
  }

  render() {
    return (
      <div>
        {this.state.loaded && (
          <SummonerInfo
            accountId={this.state.accountId}
            summonerId={this.state.summonerId}
          />
        )}
      </div>
    );
  }
}
