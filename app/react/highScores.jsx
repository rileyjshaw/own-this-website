var
React = require('react'),
Server = require('../js/server.js'),
Shared = require('./shared.jsx'),
PageLink = Shared.PageLink;

// TODO: Make it flat in gulp

var ScoreWindow = React.createClass({
  getInitialState: function() {
    return {
      scores: []
    };
  },
  handlePageChange: function(page) {
    this.props.onPageChange(page);
  },
  componentWillMount: function() {
    this.setState({scores: Server.getHighScores()});
    var component = this;
    this.updater = setInterval(function() {
      component.setState({scores: Server.getHighScores()});
    }, 3000);
  },
  componentWillUnmount: function() {
    clearInterval(this.updater);
  },
  render: function(){
    return (
      <div className="score-page">
        <ScoreTable scores={this.state.scores} />
        <PageLink onPageChange={this.handlePageChange} page="throne">Back</PageLink>
      </div>
    );
  }
});

var ScoreTable = React.createClass({
  render: function() {
    var scoreRows = this.props.scores.map(function(score) {
      return (
        <tr>
          <td>{score.name}</td>
          <td>{score.score}s</td>
        </tr>
      );
    });
    return (
      <table className="scoreList">
        {scoreRows}
      </table>
    );
  }
});

module.exports = ScoreWindow;
