var React = require('react');

var ScoreWindow = React.createClass({
  getInitialState: function() {
    return {
      scores: []
    };
  },
  componentWillMount: function() {
    this.loadScoresFromServer();
    setInterval(this.loadScoresFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className="right-page">
        <a className="back-arrow"></a>
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
