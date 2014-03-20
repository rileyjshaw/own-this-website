var React = require('react');

var server = require('../js/server.js');

var Throne = React.createClass({
  incrementScore: function() {
    this.setState({score: this.state.score + 1});
  },
  getInitialState: function() {
    return {
      name: 'Blank',
      score: 0
    };
  },
  handleNameSubmit: function(name){
    //this.setState({ name: name });
    this.setState(server.setKing(name));
  },
  componentWillMount: function() {
    this.setState(server.getKing());
    setInterval(this.incrementScore, 1000);
  },
  render: function() {
    return (
      <div className="throne-page">
        <a className="score-link"></a>
        <h1>Owner of this website:</h1>
        <ThroneMid king={this.state} onNameSubmit={this.handleNameSubmit} />
        <p>{this.state.score}s</p>
      </div>
    );
  }
});

var ThroneMid = React.createClass({
  render: function() {
    return (
      <div className="mid">
        <h2>{this.props.king.name}</h2>
        <ChallengerForm onNameSubmit={this.props.onNameSubmit} />
      </div>
    );
  }
});

var ChallengerForm = React.createClass({
  handleSubmit: function() {
    var challengerNode = this.refs.challenger.getDOMNode();
    var challenger = challengerNode.value.trim();
    if (!challenger) {
      return false;
    }
    this.props.onNameSubmit(challenger);
    this.refs.challenger.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="challengerForm" onSubmit={this.handleSubmit} >
        <input type="text" placeholder="Take it over" ref="challenger" />
        <input type="submit" value="Go" />
      </form>
    );
  }
});

module.exports = Throne;
