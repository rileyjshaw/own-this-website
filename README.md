own-this-website
================
Own This Website is an overengineered, experimental King of the Hill style game where players add their name to the front-page of a website.

## Installation
The app is separated into two parts: a static `/app` folder that can be served from gh-pages or a CDN, and a super-simple `/server` folder for serving and storing player scores.

You'll need to have [node.js](http://nodejs.org/download/) installed before continuing.

### Server
Copy the contents of `/server` to wherever you'll be serving this from, then run
```
npm install
```

To start the app, run
```
node server.js
```

### App
In `/app`, open `react/main.jsx` and change `SERVER-URL-HERE` in
```
React.renderComponent(
  <UI url="SERVER-URL-HERE" />,
  document.getElementById('app-container')
);
```
to point to your own server.

Then, run
```
npm install && gulp build
```

This should generate a `/dist` folder of static assets that you can serve from gh-pages, a CDN, or your node server.

## Issues?
[Let me know!](https://github.com/rileyjshaw/own-this-website/issues)
