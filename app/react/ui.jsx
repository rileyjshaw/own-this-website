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
    if(window.location.hostname === this.props.cdnUrl) {
      this.socket = io.connect(this.props.socketUrl + this.props.socketPort);
      this.socket.on('news', function(data) {
        console.log(data);
      });
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
    } else {
      console.log('window.location.hostname is ' + window.location.hostname + ' but I was expecting for it to be ' + this.props.cdnUrl + '.');
      console.log('Change the value of cdnUrl in /app/js/main.jsx to the correct hostname.');
    }
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
