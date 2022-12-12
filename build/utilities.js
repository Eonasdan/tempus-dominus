const fs = require('fs').promises;
const { dirname } = require('path');

class Utilities {
  static async copyFileAndEnsurePathExistsAsync(file) {
    await fs.mkdir(dirname(file.destination), { recursive: true });

    await fs.copyFile(file.source, file.destination);
  }

  static async copy() {
    for (const file of [
      {
        source: './src/js/jQuery-provider.js',
        destination: './dist/js/jQuery-provider.js',
      },
    ]) {
      console.log(`copying ${file.source} to ${file.destination}`);
      await Utilities.copyFileAndEnsurePathExistsAsync(file);
    }
  }

  static async removeFileAsync(filePath) {
    if (!(await fs.stat(filePath)).isFile()) return;
    try {
      await fs.unlink(filePath);
    } catch (e) {}
  }

  static async removeDirectoryAsync(directory, removeSelf = true) {
    try {
      await fs.rm(directory, { recursive: true, force: true });

      if (!removeSelf) await fs.mkdir(dirname(directory), { recursive: true });
    } catch (e) {
      console.error(e);
    }
  }
}

const args = process.argv.slice(2);

switch (args[0]) {
  case '--copy':
    console.log('Copying files');
    Utilities.copy().then();
    break;
  case '--clean':
    console.log('Cleaning path: ', args[1]);
    Utilities.removeDirectoryAsync(args[1]).then();
    break;
}
