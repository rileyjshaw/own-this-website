var
React = require('react/addons'),
Throne = require('./throne.jsx'),
HighScores = require('./highScores.jsx');

var Page = React.createClass({
  render: function() {
    return (
      this.props.key === 'throne'
        ? <Throne url={this.props.url} onPageChange={this.props.onPageChange} king={this.props.pageData} socket={this.props.socket} />
        : <HighScores url={this.props.url} onPageChange={this.props.onPageChange} scores={this.props.pageData} socket={this.props.socket} />
    );
  }
});

module.exports = Page;
