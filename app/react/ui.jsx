var
React = require('react/addons'),
ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
Throne = require('./throne.jsx'),
HighScores = require('./highScores.jsx');

var UI = React.createClass({
  getInitialState: function() {
    return { page: 'throne' };
  },
  handlePageChange: function(page) {
    this.setState({ page: page });
  },
  render: function() {
    var activePage;
    switch (this.state.page) {
      case 'throne':
        activePage = <Throne url={this.props.url} onPageChange={this.handlePageChange} />
        break;
      case 'scores':
        activePage = <HighScores url={this.props.url} onPageChange={this.handlePageChange} />
        break;
    }
    return (
      <ReactCSSTransitionGroup transitionName="windowabcde" component={React.DOM.div}>
        {activePage}
      </ReactCSSTransitionGroup>
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