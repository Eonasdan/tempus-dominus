# Tempus Dominus Date/Time Picker v6.0.0-alpha

![insert under construction gif here](https://media.tenor.com/images/5a75aa3a4dbbcdc3f8fc25d68eebb961/tenor.gif)

The typescript code is not in it's final form. I have a task to go through and cleanup naming etc.

## Building

run `npm i` to install needed packages.

## Running

You can run `npm start` which will start a browser-sync server. Navigate to `http://localhost:3000/src/docs/min.html` for the test screen. Note that 3000 is the default port, yours might be different.

## Watchers

Browser-sync will watch for html, css, and js changes. There are two other watchers:

Run `npm run sass-watch` to watch changes in `/src/sass/*.scss`

Run `npm run rollup-watch` to watch changes in `/src/js/*.ts`

## Random files

`src/docs/usage.html` is the example from the v5
`src/js/tempus-dominus-old.js_` combined and annotated v5 js
`src/js/tempus-dominus-old-whittle.js` same as above except I'm remove bits I've already converted
