own-this-website
================
Own This Website is an overengineered, experimental King of the Hill style game where players add their name to the front-page of a website. [The demo lives here](http://own.rileyjshaw.com).

## Installation
The app is separated into two parts: a static `app` folder that can be served from gh-pages or a CDN, and a super-simple `server` folder for serving and storing player scores.

### Fork it
First, fork the repo and clone it to your local machine by typing `git clone https://github.com/<YOUR-GITHUB-HANDLE>/own-this-website.git`. This will clone the `app`, `server`, and `test` folders, as well as this lovely `README`.

### Server
Make sure your server is running [redis](http://redis.io/topics/quickstart) and has [node.js](http://nodejs.org/download/) installed before continuing.

Copy the contents of `server` to wherever you'll be serving this from, then run
```
npm install
```

To start the app, run
```
redis-server
node main.js
```

#### Forever + Nodemon

If you want to keep the app running after you've logged off, check out [forever](https://www.npmjs.org/package/forever) and [nodemon](http://nodemon.io/). These can be installed using npm

```.bash
npm install -g forever
npm install -g nodemon
```

and run from within `/server` with something like this:

```.bash
forever start --spinSleepTime 10000 nodemon --exitcrash
```

Nodemon should know to call `main.js` based on `package.json`, but if any of this doesn't work a more involved command is included in the comments of `main.js`.

#### Ports
Right now, node is listening on port `8000` and redis is on port `6379`; if you want to use something different, just do a project-wide find (command + shift + F in Sublime) and make sure to replace all instances.

### App
*These instructions assume that you'll use gh-pages as a CDN, but the* `dist` *folder can be served from anywhere*

In `app/gulpfile.js`,

1. Change `own.rileyjshaw.com` to point to wherever your static content is being served from. This is the location that your browser will show in the address bar.
2. Change `toyserver.rileyjshaw.com` to point to your socket server.
3. Change `https://github.com/rileyjshaw/own-this-website.git` to point to your own repository.

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

#### Gulp flags

+ `--dev`: Skips minification, keeps reactify debug on, and switches everything to run on `localhost`
+ `--cdn={CDN}`: Overrides your CDN url
+ `--url={SERVER}`: Overrides your node server url
+ `--cdn={PORT}`: Overrides your node server port

`cdn`, `url`, and `port` can also be passed in as unnamed arguments in the order `[cdn, url, port]`.

### Testing

Testing is done with [mocha](http://visionmedia.github.io/mocha/) and [should](https://github.com/visionmedia/should.js/). To get set up, all you need to do is:

```.bash
npm install -g mocha
npm install -g should
```

Once you're set up, run the tests by navigating to the project root and running `mocha`

## Issues?
[Let me know!](https://github.com/rileyjshaw/own-this-website/issues)
