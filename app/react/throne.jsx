var
React = require('react/addons'),
Server = require('../js/server.js')
Shared = require('./shared.jsx'),
PageLink = Shared.PageLink;

var Throne = React.createClass({
  incrementScore: function() {
    this.setState({score: this.state.score + 1});
  },
  getInitialState: function() {
    return {
      name: 'Elvis',
      score: 0
    };
  },
  handlePageChange: function(page) {
    this.props.onPageChange(page);
  },
  handleNameSubmit: function(name){
    if (name !== this.state.name) {
      this.setState(Server.setKing(name));
    }
  },
  componentWillMount: function() {
    this.setState(Server.getKing());
    this.updater = setInterval(this.incrementScore, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.updater);
  },
  render: function() {
    return (
      <div className="throne-page">
        <h1>Owner of this website:</h1>
        <ThroneMid king={this.state} onNameSubmit={this.handleNameSubmit} />
        <p>{this.state.score}s</p>
        <PageLink onPageChange={this.handlePageChange} page="scores">High Scores</PageLink>
      </div>
    );
  }
});

var ThroneMid = React.createClass({
  handleNameSubmit: function(name) {
    this.toggleFormDisplay();
    this.props.onNameSubmit(name);
  },
  getInitialState: function() {
    return { formVisible: 0 };
  },
  toggleFormDisplay: function() {
    this.setState({ formVisible: 1 - this.state.formVisible });
  },
  render: function() {
    return (
      <div className="mid">
        { this.state.formVisible
          ? <ChallengerForm onNameSubmit={this.handleNameSubmit} ref="input" />
          : <h2 onClick={this.toggleFormDisplay}>{this.props.king.name}</h2>
        }
      </div>
    );
  }
});

var ChallengerForm = React.createClass({
  handleNameSubmit: function() {
    var challengerNode = this.refs.challenger.getDOMNode();
    var challenger = challengerNode.value.trim();
    if (!challenger) {
      return false;
    }
    this.props.onNameSubmit(challenger);
    this.refs.challenger.getDOMNode().value = '';
    return false;
  },
  componentDidMount: function() {
    this.refs.challenger.getDOMNode().focus();
  },
  render: function() {
    return (
      <form className="challengerForm" onSubmit={this.handleNameSubmit} >
        <input type="text" placeholder="Take it over" ref="challenger" />
        <button type="submit" value="Go"><img src="img/crown.svg" alt="Crown" /></button>
      </form>
    );
  }
});

module.exports = Throne;
