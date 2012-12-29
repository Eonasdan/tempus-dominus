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
./node_modules/.bin/mocha-phantomjs -R dot ./test/specs.html
