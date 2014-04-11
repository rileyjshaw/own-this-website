var React = require('react/addons');
var Shared = require('./shared.jsx');
var PageLink = Shared.PageLink;

var Throne = React.createClass({
  handlePageChange: function(page) {
    this.props.onPageChange(page);
  },
  handleNameSubmit: function(name){
    if (name !== this.props.name) {
      this.props.socket.emit('setKing', name);
    }
  },
  render: function() {
    return (
      <div className="throne-page">
        <h1>Owner of this website:</h1>
        <ThroneMid name={this.props.name} onNameSubmit={this.handleNameSubmit} />
        <p>{+this.props.initialScore + this.props.secondsElapsed}s</p>
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
          ? <ChallengerForm onNameSubmit={this.handleNameSubmit} handleBlur={this.toggleFormDisplay} ref="input" />
          : <h2 onClick={this.toggleFormDisplay}>{this.props.name}</h2>
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
        <input type="text" placeholder="Take it over" ref="challenger" onBlur={this.props.handleBlur} />
        <button type="submit" value="Go"><img src="img/crown.svg" alt="Crown" /></button>
      </form>
    );
  }
});

module.exports = Throne;
