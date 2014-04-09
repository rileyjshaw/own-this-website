var
React = require('react/addons'),
Throne = require('./throne.jsx'),
HighScores = require('./highScores.jsx');

var Page = React.createClass({
  render: function() {
    return (
      this.props.key === 'throne'
        ? <Throne
            url={this.props.url}
            onPageChange={this.props.onPageChange}
            name={this.props.name}
            initialScore={this.props.pageSpecificScore}
            socket={this.props.socket}
            secondsElapsed={this.props.secondsElapsed} />
        : <HighScores
            url={this.props.url}
            onPageChange={this.props.onPageChange}
            name={this.props.name}
            scores={this.props.pageSpecificScore}
            socket={this.props.socket}
            secondsElapsed={this.props.secondsElapsed} />
    );
  }
});

module.exports = Page;
