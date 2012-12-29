#!/bin/sh
if [ ! -x ./node_modules/.bin/phantomjs ]; then
        f='phantomjs-1.7.0-linux-i686.tar.bz2'
        d="${f%.tar.bz2}"
        wget http://phantomjs.googlecode.com/files/$f
        tar xf $f
        mv "$d/bin/phantomjs" ./node_modules/.bin/
        rm -rf "$d"
        rm "$f"
fi
jq=./test/jquery.js
if [ ! -r $jq ]; then
        wget http://code.jquery.com/jquery-1.8.3.min.js -O $jq
fi
bsjs=./test/bootstrap.js
if [ ! -r $bsjs ]; then
        wget http://netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/js/bootstrap.min.js  -O $bsjs
fi
bscss=./test/bootstrap.css
if [ ! -r $bscss ]; then
        wget http://netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/css/bootstrap-combined.min.css -O $bscss
fi

./node_modules/.bin/coffee -c ./test/specs.coffee
./node_modules/.bin/mocha-phantomjs -R dot ./test/specs.html
