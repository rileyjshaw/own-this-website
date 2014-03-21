var React = require('react');

var Throne = require('./throne.jsx');
var HighScores = require('./highScores.jsx');

var UI = React.createClass({
  render: function() {
    return (
      <div>
        <Throne url={this.props.url} />
        <HighScores url={this.props.url} />
      </div>
    );
  }
});

module.exports = UI;

/*
var window;
      if(this.state.activeWindow === 'throne') {
        window = <Throne url={this.props.url} onNameSubmit={this.handleNameSubmit} />
      } else {
        window = <HighScores />
      }

      return (
        <div>{window} {button}</div>
      )
      */