# Submitting Issues

If you are submitting a bug, please test and/or fork [this StackBlitz](https://stackblitz.com/edit/tempus-dominus-v6-simple-setup) demonstrating the issue. Code issues and fringe case bugs that do not include a StackBlitz (or similar) will be closed.

Issues that are submitted without a description (title only) will be closed with no further explanation.

# Contributing code

To contribute, fork the library and run `npm install`. You need [node](http://nodejs.org/); use [nvm](https://github.com/creationix/nvm) or [nenv](https://github.com/ryuone/nenv) to install it.

```bash
git https://github.com/Eonasdan/tempus-dominus.git
cd tempus-dominus
npm i
git checkout development  # all patches against development branch, please!
```

# Very important notes

**Pull requests to the `master` branch will be closed.** Please submit all pull requests to the `development` branch.
- **Do not include the minified files in your pull request.** Don't worry, we'll build them when we cut a release.
- Pull requests that do not include a description (title only) and the following will be closed:
  - What the change does
  - A use case (for new features or enhancements)

# NPM Scripts


| Script | Description |
|--------|------------|
| start | Launches browser sync and watches for files changes.|
| serve | Launches browser sync to serve the docs. |
| build | Creates compiled js, css and copies the extra files to the dist folder. |
| sass | Compiles just the sass files to css. |
| rollup | Compiles typescript and scss files. |
| rollup-watch | Same as above but watches for changes and compiles as needed. |
| build:declarations | Builds the typescript definition files. |
| prettier | Runs prettier to format the code. |
| docs | Builds the docs. |
| docs-watch | Watches for changes to the docs files. |
| release-version | Creates a new release version. |
