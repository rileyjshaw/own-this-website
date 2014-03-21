/** @jsx React.DOM */

var React = require('react');
var UI = require('../react/ui.jsx');

var king = 'Riley';

React.renderComponent(
  <UI url="SERVER-URL-HERE" />,
  document.getElementById('app-container')
);
