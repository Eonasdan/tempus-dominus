Submitting Issues
=================

If you are submitting a bug, please test and/or fork [this jsfiddle](http://jsfiddle.net/d3wCU/) demonstrating the issue. Code issues and fringe case bugs that do not include a jsfiddle (or similar) will be closed.

Contributing code
=================

To contribute, fork the library and install grunt and dependencies. You need [node](http://nodejs.org/); use [nvm](https://github.com/creationix/nvm) or [nenv](https://github.com/ryuone/nenv) to install it.

```bash
git clone https://github.com/Eonasdan/bootstrap-datetimepicker.git
cd bootstrap-datetimepicker
npm install -g grunt-cli
npm install
git checkout development  # all patches against development branch, please!
grunt                 # this runs tests and jshint
```

Very important notes
====================

 * **Pull pull requests to the `master` branch will be closed.** Please submit all pull requests to the `development` branch.
 * **Do not include the minified files in your pull request.** Don't worry, we'll build them when we cut a release.

Grunt tasks
===========

We use Grunt for managing the build. Here are some useful Grunt tasks:

  * `grunt` The default task lints the code and runs the tests. You should make sure you do this before submitting a PR.
  * `grunt build` Compiles the less stylesheet and minifies the javascript source in build directory.
