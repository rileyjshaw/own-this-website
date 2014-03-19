var React = require('react');

var Throne = require('./throne.jsx');
var HighScores = require('./highScores.jsx');

var UI = React.createClass({
  getInitialState: function() {
    return {
      king: '',
      scores: []
    };
  },
  handleNameSubmit: function(name){
    this.setState(
      {king: name}
    );
    var request = new XMLHttpRequest();
    request.open('POST', this.props.url, true);
    request.setRequestHeader('Content-Type', 'json');
    request.send(name);
  },
  loadScoresFromServer: function() {
    var component = this;

    request = new XMLHttpRequest();
    request.open('GET', this.props.url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
        component.setState({
          scores: JSON.parse(request.responseText)
        });
      } else {
        // We reached our target server, but it returned an error
        console.error(component.props.url, status, err.toString());
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      console.error(component.props.url, status, err.toString());
    };

    request.send();
  },
  render: function() {
      var window;
      if(this.state.activeWindow === 'throne') {
        window = <Throne url={this.props.url} onNameSubmit={this.handleNameSubmit} />
      } else {
        window = <HighScores />
      }

      return (
        <div>{window} {button}</div>
      )
 /*   return (
      <div>
        <Throne url={this.props.url} onNameSubmit={this.handleNameSubmit} />
        <HighScores scores={this.state.scores} />
      </div>
    );*/
  }
});

module.exports = UI;
