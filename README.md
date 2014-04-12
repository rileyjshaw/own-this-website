own-this-website
================
Own This Website is an overengineered, experimental King of the Hill style game where players add their name to the front-page of a website. [The demo lives here](own.rileyjshaw.com).

## Installation
The app is separated into two parts: a static `app` folder that can be served from gh-pages or a CDN, and a super-simple `server` folder for serving and storing player scores.

### Server
Make sure your server is running [redis](http://redis.io/topics/quickstart) and has [node.js](http://nodejs.org/download/) installed before continuing.

Copy the contents of `server` to wherever you'll be serving this from, then run
```
npm install
```

To start the app, run
```
node main.js
```

If you want to keep the app running after you've logged off, check out [forever](https://www.npmjs.org/package/forever).

#### Ports
Right now, node is listening on port `8000` and redis is on port `6379`.

### App
*These instructions assume that you'll use gh-pages as a CDN, but the* `dist` *folder can be served from anywhere*

In `app/react/main.jsx`,

1. Change `own.rileyjshaw.com` to point to wherever your static content is being served from. This is the location that your browser will show in the address bar.
2. Change `toyserver.rileyjshaw.com` to point to your socket server.

Open `app/react/gulpfile.js` and change `https://github.com/rileyjshaw/own-this-website.git` to point to your own repository.

Open `app/CNAME` and change `own.rileyjshaw.com` to your own domain. These are a bit tricky to set up, [but this walks you through it](https://help.github.com/articles/setting-up-a-custom-domain-with-pages).

In `app`, run
```
npm install
bower install
gulp watch
```

This should generate a `dist` folder and open the app in your browser. If it's working, hit `ctrl` + `c` to stop the watch task, then
```
gulp deploy
```

You're good to go!

#### Gulp tasks

+ `gulp watch`: Standard build tasks + watch + autoreload; use during development.
+ `gulp deploy`: Standard build tasks + push to gh-pages; use to push static files to production.
+ `gulp clean_dist`: Flushes your `dist` directory in case it gets messy.

## Issues?
[Let me know!](https://github.com/rileyjshaw/own-this-website/issues)
