var
React = require('react/addons'),
ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
Page = require('./page.jsx');

var UI = React.createClass({
  getInitialState: function() {
    return {
      page: 'throne',
      kingName: '',
      kingScore: 0,
      scores: {}
    };
  },
  handlePageChange: function(page) {
    this.setState({ page: page });
  },
  componentDidMount: function() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('news', function (data) {
      alert(data);
    });
    this.socket.on('updateKing', (function (king) {
      this.setState({kingName: king.name, kingScore: king.score});
    }).bind(this));
  },
  render: function() {
    return (
      <ReactCSSTransitionGroup transitionName="window" component={React.DOM.div}>
        <Page key={this.state.page} url={this.props.url} onPageChange={this.handlePageChange} socket={this.socket}
          pageData={ this.state.page === 'throne'
                      ? { name: this.state.kingName, initialScore: this.state.kingScore }
                      : this.state.scores
          }
        />
      </ReactCSSTransitionGroup>
    );
  }
});

module.exports = UI;
