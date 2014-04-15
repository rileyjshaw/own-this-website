/** @jsx React.DOM */

var React = require('react/addons');
var UI = require('../react/ui.jsx');

React.renderComponent(
  <UI cdnUrl="<YOUR CDN HERE>" socketUrl="<YOUR SERVER HERE>" socketPort="<PORT>" />,
  document.getElementById('app-container')
);
