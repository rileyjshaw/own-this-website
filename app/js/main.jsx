/** @jsx React.DOM */

var React = require('react/addons');
var UI = require('../react/ui.jsx');

React.renderComponent(
  <UI url="http://107.170.85.185" socketPort=':8000' />,
  document.getElementById('app-container')
);
