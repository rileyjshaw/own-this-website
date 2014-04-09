var React = require('react/addons');
var Shared = require('./shared.jsx');
var PageLink = Shared.PageLink;

// TODO: Make it flat in gulp

var ScoreWindow = React.createClass({
  getInitialState: function() {
    return {
      scores: []
    };
  },
  updateHighScores: function(scores){
    var processedScores = [];
    var i = scores.length;
    while(i) {
      processedScores.push({
        name: scores.shift(),
        score: scores.shift()
      });
      i = i - 2;
    }
    this.setState({scores: processedScores});
  },
  handlePageChange: function(page) {
    this.props.onPageChange(page);
  },
  componentWillMount: function() {
    this.props.socket.emit('getHighScores');
  },
  componentDidMount: function() {
    this.props.socket.on('updateHighScores', this.updateHighScores);
  },
  componentWillUnmount: function() {
    this.props.socket.removeListener('updateHighScores', this.updateHighScores);
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
        <tr key={score.name}>
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
