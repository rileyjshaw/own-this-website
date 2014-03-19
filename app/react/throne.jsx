var React = require('react');

//onClick={alert('yo')}

var Throne = React.createClass({
  render: function() {
    return (
      <div className="left-page">
        <a className="forward-arrow"></a>
        <h1>Owner of this website:</h1>
        <ThroneMid king={this.props.url[0]} />
        <p>{this.props.url[0].score}s</p>
      </div>
    );
  }
});

var ThroneMid = React.createClass({
  handleSubmit: function() {
    var challenger = challenger.refs.challenger.getDOMNode().value.trim();
    if (!challenger) {
      return false;
    }
    this.props.onNameSubmit({challenger: challenger});
    this.refs.challenger.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <div className="mid">
        <h2>{this.props.king.name}</h2>
        <form className="challengerForm" onSubmit={this.handleSubmit} >
          <input type="text" placeholder="Take it over" ref="challenger" />
          <input type="submit" value="Post" />
        </form>
      </div>
    );
  }
});

module.exports = Throne;
