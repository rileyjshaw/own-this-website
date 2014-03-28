/** @jsx React.DOM */

var React = require('react/addons');
var UI = require('../react/ui.jsx');

React.renderComponent(
  <UI url="SERVER-URL-HERE" />,
  document.getElementById('app-container')
);
