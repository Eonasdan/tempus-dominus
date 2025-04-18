const fs = require('fs');
const path = require('path');
const globby = require('globby');

// Function to update version in a file
function updateVersionInFile(filePath, oldVersion, newVersion) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(
      new RegExp(oldVersion.replace(/\./g, '\\.'), 'g'),
      newVersion
    );

    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated version in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function updateVersions(newVersion) {
  try {
    // Read current version from package.json
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const currentVersion = packageJson.version;

    if (!currentVersion) {
      throw new Error('Could not find version in package.json');
    }

    // Update package.json
    packageJson.version = newVersion;
    fs.writeFileSync(
      './package.json',
      JSON.stringify(packageJson, null, 2) + '\n'
    );
    console.log('Updated version in package.json');

    const GLOB = [
      '**/*.{json,md,nuspec,properties}',
      'src/js/tempus-dominus.ts',
      '**/shell.html',
      '**/installing.html',
      '**/templates/index.html',
      '!**/change-log*',
      '!test/**/*',
    ];

    const GLOBBY_OPTIONS = {
      cwd: path.join(__dirname, '..'),
      gitignore: true,
    };

    const files = await globby(GLOB, GLOBBY_OPTIONS);

    //make sure that the dist folder is included
    files.push(
      ...(await globby(['dist/**/*'], {
        cwd: path.join(__dirname, '..'),
      }))
    );

    // Update version in each file
    for (const file of files) {
      updateVersionInFile(file, currentVersion, newVersion);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get new version from command line argument
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please provide a new version number as an argument');
  console.error('Usage: node update-version.js <new-version>');
  process.exit(1);
}

// Execute the update
updateVersions(newVersion);
