var React = require('react/addons');
var Shared = require('./shared.jsx');
var PageLink = Shared.PageLink;

var Throne = React.createClass({
  handlePageChange: function(page) {
    this.props.onPageChange(page);
  },
  handleNameSubmit: function(name){
    name = name.toUpperCase();
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
  getInitialState: function() {
    return { formVisible: 0 };
  },
  handleNameSubmit: function(name) {
    this.toggleFormDisplay();
    this.props.onNameSubmit(name);
  },
  handleBlur: function(element) {
    //jumping through hoops because blur event might trigger
    //before submit, which kills the form when the submit
    //button is clicked
    setTimeout(function() {
      if(!element.contains(document.activeElement)) {
        this.toggleFormDisplay();
      }
    }.bind(this), 1);
  },
  handleTouchSubmit: function() {
    //unfortunate hack
    setTimeout(this.toggleFormDisplay, 1000);
  },
  toggleFormDisplay: function() {
    this.setState({ formVisible: 1 - this.state.formVisible });
  },
  render: function() {
    return (
      <div className="mid">
        { this.state.formVisible
          ? <ChallengerForm onNameSubmit={this.handleNameSubmit} handleBlur={this.handleBlur} handleTouchSubmit={this.handleTouchSubmit} />
          : <h2 onClick={this.toggleFormDisplay}>{this.props.name}</h2>
        }
      </div>
    );
  }
});

var ChallengerForm = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },
  componentWillMount: function() {
    React.initializeTouchEvents(true);
  },
  componentDidMount: function() {
    key.setScope('input');
    key.filter = function filter(event){
      return true;
    };
    key('esc', this.props.handleBlur);
    this.refs.challenger.getDOMNode().focus();
  },
  componentWillUnmount: function() {
    key.setScope('all');
    key.filter = function filter(event){
      var tagName = (event.target || event.srcElement).tagName;
      return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    };
    key.unbind('esc', this.props.handleBlur);
  },
  handleBlur: function() {
    //jumping through hoops (part 2)
    this.props.handleBlur(this.refs.form.getDOMNode());
  },
  handleChange: function(event) {
    this.setState({value: event.target.value.substr(0, 12)});
  },
  handleNameSubmit: function() {
    var challengerNode = this.refs.challenger.getDOMNode();
    var challenger = challengerNode.value.trim();
    if (!challenger || typeof challenger !== 'string') {
      return false;
    }
    this.props.onNameSubmit(challenger);
    this.refs.challenger.getDOMNode().value = '';
    return false;
  },
  render: function() {

    return (
      <form className="challengerForm" onBlur={this.handleBlur} onSubmit={this.handleNameSubmit} ref="form" >
        <input type="text" placeholder="Take it over" ref="challenger" value={this.state.value} onChange={this.handleChange} />
        <button type="submit" value="Go" onTouchStart={this.props.handleTouchSubmit} >
          <img src="img/crown.svg" alt="Crown" />
        </button>
      </form>
    );
  }
});

module.exports = Throne;
