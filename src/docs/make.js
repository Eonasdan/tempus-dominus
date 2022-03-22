const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const path = require('path');
const minifyHtml = require('html-minifier-terser').minify;
const dropCss = require('dropcss');
const cleanCSS = require('clean-css');
const { minify } = require('terser');
const sass = require('sass');
const chokidar = require('chokidar');
const rootDirectory = path.join('.','src','docs','partials');

class PageMeta {
  file;
  title;
  body;
  postDate;
  updateDate;
  excerpt;
  tags = '';

  constructor(
    file = '',
    title = '',
    body = '',
    postDate = '',
    updateDate = '',
    excerpt = '',
    tags = ''
  ) {
    this.file = file;
    this.title = title;
    this.body = body;
    this.postDate = postDate;
    this.updateDate = updateDate;
    this.excerpt = excerpt;
    this.tags = tags;
  }

  parse(metaTag) {
    if (!metaTag) return;
    const title = metaTag.querySelector('title')?.innerHTML;
    if (title) this.title = title;

    const postDate = metaTag.querySelector('post-date')?.innerHTML;
    if (postDate) this.postDate = postDate;

    const updateDate = metaTag.querySelector('update-date')?.innerHTML;
    if (updateDate) this.updateDate = updateDate;

    const excerpt = metaTag.querySelector('excerpt')?.innerHTML;
    if (excerpt) this.excerpt = excerpt;

    const tags = metaTag.querySelector('tags')?.innerHTML;
    if (tags) this.tags = tags;
  }
}

class FileInformation {
  file;
  isDirectory;
  fullPath;
  extension;
  relativePath;

  constructor(file, fullPath, isDirectory, extension) {
    this.relativePath = fullPath
      .replace(rootDirectory.replace(`.${path.sep}`, ''), '');
    this.file = file;
    this.fullPath = fullPath;
    this.isDirectory = isDirectory;
    this.extension = extension;
  }
}

class Build {
  shellTemplate = '';
  pageTemplate = '';
  postLoopTemplate = '';
  //create meta info
  pagesMeta = [];

  // prepare site map
  siteMap = '';

  css = '';
  cssWhitelist = new Set();

  updateAll() {
    this.shellTemplate = this.loadTemplate('shell');
    this.pageTemplate = this.pageDocument;
    this.postLoopTemplate = this.loadTemplate(`post-loop`);
    this.reset();
    this.update404();
    this.prepareCss();
    this.updatePages();
    this.updateHomepage();
    this.minifyJs().then();
    this.updateDist();
    this.copyAssets();
  }

  reset() {
    this.pagesMeta = [];
    this.homePageHtml = '';
    this.siteMap = '';
  }

  loadTemplate(template) {
    return fs.readFileSync(path.join('.','src','docs', 'templates', `${template}.html`), 'utf8');
  }

  directoryWalk(directory, extension = '.html') {
    let files = [];
    fs.readdirSync(directory)
      .map((x) => {
        const fullPath = path.join(directory, x);

        return new FileInformation(
          x,
          fullPath,
          fs.statSync(fullPath).isDirectory(),
          path.extname(x).toLowerCase()
        );
      })
      .filter(
        (x) => path.extname(x.file).toLowerCase() === extension || x.isDirectory
      )
      .forEach((x) => {
        if (x.isDirectory) {
          files = [...files, ...this.directoryWalk(x.fullPath)];
        } else {
          files.push(x);
        }
      });

    return files;
  }

  getSearchBody(html) {
    const bodyPrep = html.textContent
      .toLowerCase()
      .replace('.', ' ') //replace dots with spaces
      //.replace(/((?<=\s)|(?=\s))[^(\w )]*|[^(\w )]*((?<=\s)|(?=\s))/gm, ' ') //remove special characters
      .replace(/((?<=\s)|(?=\s))[^a-z ]*|[^a-z ]*((?<=\s)|(?=\s))/gm, ' ') //remove special characters
      //.replace(/[^a-z ]*/gm, '') //remove special characters
      .replace(/\s+/g, ' ')
      .trim() //replace extra white space
      .split(' '); // split at words;
    return Array.from(new Set(bodyPrep)).join(' '); //remove duplicate words
  }

  removeDirectory(directory, removeSelf) {
    if (removeSelf === undefined) removeSelf = true;
    try {
      const files = fs.readdirSync(directory) || [];
      files.forEach((file) => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
        else this.removeDirectory(filePath);
      });
    } catch (e) {
      return;
    }
    if (removeSelf) fs.rmdirSync(directory);
  }

  copyDirectory(source, destination) {
    fs.mkdirSync(destination, { recursive: true });

    fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
      let sourcePath = path.join(source, entry.name);
      let destinationPath = path.join(destination, entry.name);

      entry.isDirectory()
        ? this.copyDirectory(sourcePath, destinationPath)
        : this.copyFileAndEnsurePathExists(sourcePath, destinationPath);
    });
  }

  copyFileAndEnsurePathExists(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.copyFileSync(filePath, content);
  }

  writeFileAndEnsurePathExists(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, content);
  }

  // since everyone has to have their own meta data *rolls eyes* the primary purpose here
  // is to quickly find similar tags and set them all at once
  setMetaContent(rootElement, selector, content) {
    [...rootElement.getElementsByClassName(selector)].forEach((element) => {
      if (content) {
        element.setAttribute('content', content);
        element.removeAttribute('class');
      } else rootElement.getElementsByTagName('head')[0].removeChild(element);
    });
  }

  // doing this as a function so I don't have to null check values inline
  setStructuredData(structure, property, value) {
    if (!value) return;

    structure[property] = value;
  }

  createRootHtml(html) {
    html = minifyHtml(html, {
      collapseWhitespace: false,
      removeComments: true,
    });

    return `<!DOCTYPE html>
<html lang='en'>${html}
</html>`;
  }

  get shellDocument() {
    return new JSDOM(this.shellTemplate).window.document;
  }

  //read css files
  prepareCss() {
    this.cssWhitelist = new Set();
    this.cssWhitelist.add('mt-30');

    this.css = sass
      .renderSync({
        file: path.join('.', 'src', 'docs', 'styles', 'styles.scss'),
      })
      .css.toString();
  }

  //read post template
  get pageDocument() {
    const indexDocument = new JSDOM(this.loadTemplate('page-template')).window
      .document;
    const shell = this.shellDocument;
    shell.getElementById('outerContainer').innerHTML =
      indexDocument.documentElement.innerHTML;
    return shell.documentElement.innerHTML;
  }

  updatePages() {
    this.reset();
    //remove old stuff
    this.removeDirectory(`./${siteConfig.output}`, false);

    /*  const pages = fs
      .readdirSync('./src/docs/partials')
      .filter((file) => path.extname(file).toLowerCase() === '.html');
*/
    const pageMarch = (pages) => {
      pages.forEach((fileInformation) => {
        /*
         const fullyQualifiedUrl = `${siteConfig.root}/${siteConfig.output}/${file}`;
      const fullPath = `./src/docs/partials/${file}`;
         */
        const fullyQualifiedUrl = `${siteConfig.root}/${siteConfig.output}/${fileInformation.relativePath}`;
        const fullPath = fileInformation.fullPath;
        const newPageDocument = new JSDOM(this.pageTemplate).window.document;
        const postDocument = new JSDOM(fs.readFileSync(fullPath, 'utf8')).window
          .document;
        const article = postDocument.querySelector('page-body');
        if (!article) {
          console.error(`failed to read body for ${fullPath}`);
          return;
        }

        const fileModified = fs.statSync(fullPath).mtime;

        let pageMeta = new PageMeta(
          fileInformation.file,
          fileInformation.file.replace(fileInformation.extension, ''),
          this.getSearchBody(article),
          fileModified,
          fileModified
        );

        pageMeta.parse(postDocument.querySelector('page-meta'));

        /*const postTagsDiv = postDocument.createElement('div');
        postTagsDiv.classList.add('post-tags', 'mt-30');
        const postTagsUl = postDocument.createElement('ul');

        pageMeta.tags
          ?.split(',')
          .map((tag) => tag.trim())
          .forEach((tag) => {
            const li = postDocument.createElement('li');
            const a = postDocument.createElement('a');
            a.setAttribute('href', `/?search=tag:${tag}`);
            a.innerHTML = tag;
            li.appendChild(a);
            postTagsUl.appendChild(li);
          });

        postTagsDiv.appendChild(postTagsUl);
        article.appendChild(postTagsDiv);*/

        //const loopDocument = new JSDOM(this.postLoopTemplate).window.document;
        newPageDocument.getElementById('mainContent').innerHTML =
          article.innerHTML;

        const publishDate = new Date(pageMeta.postDate).toISOString();

        // create structured data
        /*const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          author: {
            '@type': 'Person',
            name: pageMeta.author.name,
            url: pageMeta.author.url,
          },
        };*/

        newPageDocument.title = pageMeta.title + ' - Tempus Dominus';

        this.setMetaContent(newPageDocument, 'metaTitle', pageMeta.title);
        //this.setStructuredData(structuredData, 'headline', pageMeta.title);
        this.setInnerHtml(
          newPageDocument.getElementsByClassName('title')[0],
          pageMeta.title
        );
        /*loopDocument.getElementsByClassName(
          'post-link'
        )[0].href = `/${siteConfig.output}/${pageMeta.file}`;*/

        this.setMetaContent(
          newPageDocument,
          'metaDescription',
          pageMeta.excerpt
        );
        this.setMetaContent(newPageDocument, 'metaUrl', fullyQualifiedUrl);
        /* this.setStructuredData(
          structuredData,
          'mainEntityOfPage',
          fullyQualifiedUrl
        );*/

        this.setMetaContent(newPageDocument, 'metaPublishedTime', publishDate);
        //this.setStructuredData(structuredData, 'datePublished', publishDate);
        /*this.setInnerHtml(
          loopDocument.getElementsByClassName('post-date')[0],
          pageMeta.postDate
        );*/

        if (!pageMeta.updateDate) pageMeta.updateDate = pageMeta.postDate;
        const updateDate = new Date(pageMeta.updateDate).toISOString();
        this.setMetaContent(newPageDocument, 'metaModifiedTime', updateDate);
        //this.setStructuredData(structuredData, 'dateModified', updateDate);

        this.setMetaContent(newPageDocument, 'metaTag', pageMeta.tags);
        /*this.setStructuredData(
          structuredData,
          'keywords',
          pageMeta.tags.split(', ')
        );*/
        /* this.setInnerHtml(
          loopDocument.getElementsByClassName('post-excerpt')[0],
          pageMeta.excerpt
        );*/

        this.pagesMeta.push(pageMeta);

        // push structured data to body
        /*const structuredDataTag = newPageDocument.createElement('script');
        structuredDataTag.type = 'application/ld+json';
        structuredDataTag.innerHTML = JSON.stringify(structuredData, null, 2);*/
        /*newPageDocument
          .getElementsByTagName('body')[0]
          .appendChild(structuredDataTag);*/

        const completeHtml = this.createRootHtml(
          newPageDocument.documentElement.innerHTML
        );
        this.writeFileAndEnsurePathExists(
          path.join('.', siteConfig.output, fileInformation.relativePath),
          completeHtml
        );

        //update pure css
        dropCss({
          css: this.css,
          html: completeHtml,
        }).sels.forEach((sel) => this.cssWhitelist.add(sel));

        //add to homepage html

        /*this.homePageHtml +=
          loopDocument.getElementsByTagName('body')[0].innerHTML;*/

        this.siteMap += `<url>
<loc>${fullyQualifiedUrl}</loc>
<lastmod>${new Date(pageMeta.updateDate).toISOString()}</lastmod>
<priority>0.80</priority>
</url>`;
      });
    };

    pageMarch(this.directoryWalk(rootDirectory));

    this.pagesMeta = this.pagesMeta.sort((a, b) => {
      return +new Date(a.postDate) > +new Date(b.postDate) ? -1 : 0;
    });

    this.writeFileAndEnsurePathExists(
      path.join('.', 'docs', '6', 'js', 'search.json'),
      JSON.stringify(this.pagesMeta, null, 2)
    );

    this.updateSiteMap();
    this.updateHomepage();
    this.cleanCss();
    this.updateDist();
    this.copyAssets();
  }

  updateHomepage() {
    const indexDocument = new JSDOM(
      fs.readFileSync(path.join('.','src', 'docs','templates', 'index.html'), 'utf8')
    ).window.document;

    const shell = this.shellDocument;
    shell.getElementById('outerContainer').innerHTML =
      indexDocument.documentElement.innerHTML;

    const script = shell.createElement('script');
    script.type = 'module';
    script.innerHTML =
      "import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';";

    shell.getElementsByTagName('head')[0].appendChild(script);

    const el = shell.createElement('pwa-update');
    shell.body.appendChild(el);

    const completeHtml = this.createRootHtml(shell.documentElement.innerHTML);
    this.writeFileAndEnsurePathExists(path.join('.','docs','index.html'), completeHtml);
    dropCss({
      css: this.css,
      html: completeHtml,
    }).sels.forEach((sel) => this.cssWhitelist.add(sel));
  }

  update404() {
    const indexDocument = new JSDOM(
      fs.readFileSync(path.join('.','src','docs','templates','404.html'), 'utf8')
    ).window.document;
    const shell = this.shellDocument;
    shell.getElementById('outerContainer').innerHTML =
      indexDocument.documentElement.innerHTML;

    const completeHtml = this.createRootHtml(shell.documentElement.innerHTML);
    this.writeFileAndEnsurePathExists(
      path.join('.', 'docs','404.html'),
      this.createRootHtml(shell.documentElement.innerHTML)
    );
    dropCss({
      css: this.css,
      html: completeHtml,
    }).sels.forEach((sel) => this.cssWhitelist.add(sel));
  }

  updateSiteMap() {
    this.siteMap = `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${siteConfig.root}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<priority>1.00</priority>
</url>
${this.siteMap}
</urlset>`;
    this.writeFileAndEnsurePathExists(path.join('.','docs','sitemap.xml'), this.siteMap);
  }

  updateCss() {
    this.prepareCss();

    const gatherCss = (fullPath) => {
      const postDocument = new JSDOM(fs.readFileSync(fullPath, 'utf8')).window
        .document;
      dropCss({
        css: this.css,
        html: postDocument.documentElement.innerHTML,
      }).sels.forEach((sel) => this.cssWhitelist.add(sel));
    };

    /* fs.readdirSync('./src/docs/partials')
      .filter((file) => path.extname(file).toLowerCase() === '.html')
      .map((file) => `./src/docs/partials/${file}`)*/
    this.directoryWalk(rootDirectory)
      .map((x) => x.fullPath)
      .forEach(gatherCss);

    fs.readdirSync(path.join('.','src','docs','templates'))
      .filter((file) => path.extname(file).toLowerCase() === '.html')
      .map((file) =>  path.join('.','src','docs','templates', file))
      .forEach(gatherCss);

    this.cleanCss();
  }

  cleanCss() {
    let cleaned = dropCss({
      html: '',
      css: this.css,
      shouldDrop: (sel) => !this.cssWhitelist.has(sel),
    });
    this.writeFileAndEnsurePathExists(
      path.join('.','docs','css', 'styles.min.css'),
      //new cleanCSS().minify(cleaned.css).styles
      this.css
    );
  }

  async minifyJs() {
    const loopDocument = new JSDOM(this.postLoopTemplate).window.document;
    const getJs = () => {
      let output = '';

      const files = fs
        .readdirSync('./src/docs/js')
        .filter(
          (file) =>
            path.extname(file).toLowerCase() === '.js' &&
            !file.includes('.min.')
        );

      files.forEach((file) => {
        output += fs.readFileSync(`./src/docs/js/${file}`, 'utf8') + '\r\n';
      });

      output += '//Popper\r\n';
      //bundle popper
      output +=
        fs.readFileSync(
          `./node_modules/@popperjs/core/dist/umd/popper.js`,
          'utf8'
        ) + '\r\n';

      //bundle bootstrap
      output +=
        fs.readFileSync(
          `./node_modules/bootstrap/dist/js/bootstrap.js`,
          'utf8'
        ) + '\r\n';

      return output;
    };

    const js = getJs().replace(
      '[POSTLOOP]',
      loopDocument.getElementsByTagName('body')[0].innerHTML
    );

    const uglified = await minify(js);

    this.writeFileAndEnsurePathExists('./docs/js/bundle.js', js);
    this.writeFileAndEnsurePathExists('./docs/js/bundle.min.js', uglified.code);
  }

  setInnerHtml(element, value) {
    if (!element) return;
    element.innerHTML = value;
  }

  updateDist() {
    this.copyDirectory(path.join('.','dist', 'js'), path.join('.', siteConfig.output, 'js'));
    this.copyDirectory(path.join('.','dist', 'css'), path.join('.', siteConfig.output, 'css'));
    this.copyDirectory(path.join('.','dist', 'plugins'), path.join('.', siteConfig.output, 'js', 'plugins'));
    this.copyDirectory(path.join('.','dist', 'locales'), path.join('.', siteConfig.output, 'js', 'locales'));
  }

  /**
   * This is to copy files that don't belong to another process like images
   * and unthemed paged
   */
  copyAssets() {
    [
      {
        source: './src/docs/assets/no-styles.html',
        destination: './docs/6/examples/no-styles.html',
      },
    ].forEach((file) => {
      fs.mkdirSync(path.dirname(file.destination), { recursive: true });
      fs.copyFileSync(file.source, file.destination);
    });

    fs.mkdirSync('./docs/6/images', { recursive: true });
    this.directoryWalk('./src/docs/assets', '.png').forEach(
      (fileInformation) => {
        fs.copyFileSync(
          fileInformation.fullPath,
          `./docs/6/images/${fileInformation.file}`
        );
      }
    );
  }
}

const formatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

const log = (message) => {
  console.log(`[Make: ${formatter.format(new Date())}] ${message}`);
};

/**
 * Site configuration
 * @type {object}
 * @property {string} root - Base url for the site.
 * @property {string} output - Where the built partials will go.
 */
const siteConfig = JSON.parse(
  fs.readFileSync(`./src/docs/site-config.json`, 'utf8')
);

log('Building...');
const builder = new Build();
builder.updateAll();

if (process.argv.slice(2)[0] === '--watch') {
  const watcher = chokidar.watch(
    [
      path.join('src', 'docs', 'partials'),
      path.join('src', 'docs', 'styles'),
      path.join('src', 'docs', 'templates'),
      path.join('src', 'docs', 'js'),
      path.join('src', 'docs', 'assets'),
      'dist/',
    ],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      //ignored: /(^|[\/\\])\..|make\.js|browser-sync-config\.js/g, // ignore dotfiles
      ignoreInitial: true,
    }
  );

  let lastChange = '';
  let lastChangeFile = '';

  const handleChange = (event, file) => {
    if (file.includes('.map.')) return;
    log(`${event}: ${file}`);
    try {
      if (file.startsWith('dist')) {
        builder.updateDist();
      }
      if (file.startsWith(path.join('src', 'docs', 'assets'))) {
        builder.copyAssets();
      }
      if (file.startsWith(path.join('src', 'docs', 'partials'))) {
        //reading the file stats seems to trigger this twice, so if the same file changed in less then a second, ignore
        if (
          lastChange === formatter.format(new Date()) &&
          lastChangeFile === file
        ) {
          log(`Skipping duplicate trigger`);
          return;
        }
        builder.updatePages();
      }
      if (file.startsWith(path.join('src', 'docs', 'styles'))) {
        builder.updateCss();
      }
      if (file.startsWith(path.join('src', 'docs', 'templates'))) {
        builder.updateAll();
      }
      if (file.startsWith(path.join('src', 'docs', 'js'))) {
        builder.minifyJs().then();
      }
      log('\x1b[32m Update successful');
      lastChange = formatter.format(new Date());
      lastChangeFile = file;
      console.log('');
    } catch (e) {
      log('Something went wrong');
      console.log(e);
      console.log('');
    }
  };

  watcher
    .on('all', handleChange)
    .on('ready', () => console.log('[Make] Watching files...'));
}
