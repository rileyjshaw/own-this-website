var
React = require('react/addons');

var PageLink = React.createClass({
  render: function() {
    return (
      <a className="page-link"
         onClick={function() {
          this.props.onPageChange(this.props.page);
         }.bind(this) }
      >{this.props.children}</a>
    );
  }
});

module.exports = {
  PageLink: PageLink
};
