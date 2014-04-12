/** @jsx React.DOM */

var React = require('react/addons');
var UI = require('../react/ui.jsx');

React.renderComponent(
  <UI cdnUrl="own.rileyjshaw.com" socketUrl="toyserver.rileyjshaw.com" socketPort=':8000' />,
  document.getElementById('app-container')
);
