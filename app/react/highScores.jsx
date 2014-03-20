var React = require('react');

// TODO: Make it flat in gulp
var server = require('../js/server.js')

var ScoreWindow = React.createClass({
  getInitialState: function() {
    return {
      scores: []
    };
  },
  componentWillMount: function() {
    this.setState({scores: server.getHighScores()});
    var component = this;
    setInterval(function() {
      component.setState({scores: server.getHighScores()});
    }, 3000);
  },
  render: function(){
    return (
      <div className="score-page">
        <a className="throne-link"></a>
        <ScoreTable scores={this.state.scores} />
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
