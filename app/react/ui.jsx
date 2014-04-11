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
      scores: [1, 2, 3],
      secondsElapsed: 0
    };
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  handlePageChange: function(page) {
    this.setState({ page: page });
  },
  componentDidMount: function() {
    this.socket = io.connect(this.props.url + this.props.socketPort);
    this.socket.on('news', alert);
    this.socket.on('updateKing', (function (king) {
      this.setState({kingName: king.name, kingScore: +king.score, secondsElapsed: 0});
    }).bind(this));
    this.socket.on('updateKingInitial', (function (king) {
      this.setState({kingName: king.name, kingScore: king.score, secondsElapsed: 0});
      if(!this.timer) {
        this.timer = setInterval(this.tick, 1000);
        this.tick();
      }
    }).bind(this));
  },
  render: function() {
    return (
      <ReactCSSTransitionGroup transitionName="window" component={React.DOM.div}>
        <Page key={this.state.page} onPageChange={this.handlePageChange} socket={this.socket} secondsElapsed={this.state.secondsElapsed} name={this.state.kingName}
          pageSpecificScore={ this.state.page === 'throne'
                      ? this.state.kingScore
                      : this.state.scores
          }
        />
      </ReactCSSTransitionGroup>
    );
  }
});

module.exports = UI;
