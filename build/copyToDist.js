const fs = require('fs');
const { dirname } = require('path');

function copyFileAndEnsurePathExistsAsync(file) {
  fs.mkdirSync(dirname(file.destination), {recursive: true});

  fs.copyFileSync(file.source, file.destination);
}

function copy() {
  [
    {
      source: './src/js/jQuery-provider.js', destination: './dist/js/jQuery-provider.js'
    }
  ].forEach(file => {
    console.log(`copying ${file.source} to ${file.destination}`);
    copyFileAndEnsurePathExistsAsync(file)
  });
}

copy();
