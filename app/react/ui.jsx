var
React = require('react/addons'),
ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
Page = require('./page.jsx');

var UI = React.createClass({
  getInitialState: function() {
    return { page: 'throne' };
  },
  handlePageChange: function(page) {
    this.setState({ page: page });
  },
  render: function() {
    return (
      <ReactCSSTransitionGroup transitionName="window" component={React.DOM.div}>
        <Page key={this.state.page} url={this.props.url} onPageChange={this.handlePageChange} />
      </ReactCSSTransitionGroup>
    );
  }
});

module.exports = UI;
