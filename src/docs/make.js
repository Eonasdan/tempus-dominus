const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const path = require('path');
const minifyHtml = require('html-minifier-terser').minify;
const dropCss = require('dropcss');
const cleanCSS = require('clean-css');
const {minify} = require('terser');
const sass = require("sass");
const chokidar = require('chokidar');

class PostMeta {
    file;
    title;
    body;
    postDate;
    updateDate;
    thumbnail;
    excerpt;
    tags = '';
    author;

    constructor(file = '', title = '', body = '', postDate = '', updateDate = '',
                thumbnail = '', excerpt = '', tags = '', author = new PostAuthor()) {
        this.file = file;
        this.title = title;
        this.body = body;
        this.postDate = postDate;
        this.updateDate = updateDate;
        this.thumbnail = thumbnail;
        this.excerpt = excerpt;
        this.tags = tags;
        this.author = author;
    }

    parse(metaTag) {
        if (!metaTag) return;
        const title = metaTag.querySelector('title')?.innerHTML;
        if (title) this.title = title;

        const thumbnail = metaTag.querySelector('thumbnail')?.innerHTML;
        if (thumbnail) this.thumbnail = thumbnail;

        const postDate = metaTag.querySelector('post-date')?.innerHTML;
        if (postDate) this.postDate = postDate;

        const updateDate = metaTag.querySelector('update-date')?.innerHTML;
        if (updateDate) this.updateDate = updateDate;

        const excerpt = metaTag.querySelector('excerpt')?.innerHTML;
        if (excerpt) this.excerpt = excerpt;

        const tags = metaTag.querySelector('tags')?.innerHTML;
        if (tags) this.tags = tags;

        const postAuthor = metaTag.querySelector('post-author')?.innerHTML;
        if (postAuthor) {
            const name = metaTag.querySelector('name')?.innerHTML;
            if (name) this.author.name = name;

            const url = metaTag.querySelector('url')?.innerHTML;
            if (url) this.author.url = url;
        }
    }
}

class PostAuthor {
    name;
    url;

    constructor(name = '', url = '') {
        this.name = name;
        this.url = url;
    }
}

class Build {
    shellTemplate = '';
    postTemplate = '';
    postLoopTemplate = '';
    //create meta info
    postsMeta = [];

//prepare the static homepage text
//todo at some point we'll have to deal with paging or infinite scrolls or something
    homePageHtml = '';

// prepare site map
    siteMap = '';

    css = '';
    cssWhitelist = new Set();

    updateAll() {
        this.shellTemplate = this.loadTemplate('shell');
        this.postTemplate = this.postDocument;
        this.postLoopTemplate = this.loadTemplate(`post-loop`);
        this.reset();
        this.update404();
        this.prepareCss();
        this.updatePosts();
        this.minifyJs().then();
    }

    reset() {
        this.postsMeta = [];
        this.homePageHtml = '';
        this.siteMap = '';
    }

    loadTemplate(template) {
        return fs.readFileSync(`./build/templates/${template}.html`, 'utf8')
    }

    getSearchBody(html) {
        const bodyPrep = html.textContent
            .toLowerCase()
            .replace('.', ' ') //replace dots with spaces
            //.replace(/((?<=\s)|(?=\s))[^(\w )]*|[^(\w )]*((?<=\s)|(?=\s))/gm, ' ') //remove special characters
            .replace(/((?<=\s)|(?=\s))[^a-z ]*|[^a-z ]*((?<=\s)|(?=\s))/gm, ' ') //remove special characters
            //.replace(/[^a-z ]*/gm, '') //remove special characters
            .replace(/\s+/g, ' ').trim() //replace extra white space
            .split(' ');// split at words;
        return Array.from(new Set(bodyPrep)).join(' '); //remove duplicate words
    }

    removeDirectory(directory, removeSelf) {
        if (removeSelf === undefined) removeSelf = true;
        try {
            const files = fs.readdirSync(directory) || [];
            files.forEach(file => {
                const filePath = path.join(directory, file);
                if (fs.statSync(filePath).isFile())
                    fs.unlinkSync(filePath);
                else
                    this.removeDirectory(filePath);
            })
        } catch (e) {
            return;
        }
        if (removeSelf)
            fs.rmdirSync(directory);
    }

    // since everyone has to have their own meta data *rolls eyes* the primary purpose here
    // is to quickly find similar tags and set them all at once
    setMetaContent(rootElement, selector, content) {
        [...rootElement.getElementsByClassName(selector)].forEach(element => {
            if (content) {
                element.setAttribute("content", content);
                element.removeAttribute("class");
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
            collapseWhitespace: true,
            removeComments: true
        });

        return `<!DOCTYPE html>
<html lang="en">${html}
</html>`;
    }

    get shellDocument() {
        return new JSDOM(this.shellTemplate).window.document;
    }

    //read css files
    prepareCss() {
        this.cssWhitelist = new Set();

        this.cssWhitelist.add('post-tags');
        this.cssWhitelist.add('mt-30');

        this.css = sass.renderSync({
            file: './build/styles/style.scss',
        }).css.toString();
    }

    //read post template
    get postDocument() {
        const indexDocument = new JSDOM(this.loadTemplate('post-template')).window.document;
        const shell = this.shellDocument;
        shell.getElementById('mainContent').innerHTML = indexDocument.documentElement.innerHTML;
        return shell.documentElement.innerHTML;
    }

    updatePosts() {
        this.reset();
        //remove old stuff
        this.removeDirectory(`./${siteConfig.output}`, false);

        const posts = fs
            .readdirSync('./build/partials')
            .filter(file => path.extname(file).toLowerCase() === '.html');

        posts.forEach(file => {
            const fullyQualifiedUrl = `${siteConfig.root}/${siteConfig.output}/${file}`;
            const fullPath = `./build/partials/${file}`;
            const newPageDocument = new JSDOM(this.postTemplate).window.document;
            const postDocument = new JSDOM(fs.readFileSync(fullPath, 'utf8')).window.document;
            const article = postDocument.querySelector('article');
            if (!article) {
                console.error(`failed to read article body for ${fullPath}`);
                return;
            }

            const fileModified = fs.statSync(fullPath).mtime;

            let postMeta = new PostMeta(file, file.replace(path.extname(file), ''), this.getSearchBody(article), fileModified, fileModified);

            postMeta.parse(postDocument.querySelector('post-meta'));

            const postTagsDiv = postDocument.createElement('div');
            postTagsDiv.classList.add('post-tags', 'mt-30');
            const postTagsUl = postDocument.createElement('ul');

            postMeta.tags?.split(',').map(tag => tag.trim()).forEach(tag => {
                const li = postDocument.createElement('li');
                const a = postDocument.createElement('a');
                a.setAttribute('href', `/?search=tag:${tag}`);
                a.innerHTML = tag;
                li.appendChild(a);
                postTagsUl.appendChild(li);
            });

            postTagsDiv.appendChild(postTagsUl);
            article.appendChild(postTagsDiv);

            const loopDocument = new JSDOM(this.postLoopTemplate).window.document;
            newPageDocument.getElementById('post-inner').innerHTML = article.innerHTML;

            const publishDate = new Date(postMeta.postDate).toISOString();

            // create structured data
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "author": {
                    "@type": "Person",
                    "name": postMeta.author.name,
                    "url": postMeta.author.url
                },
            };

            newPageDocument.title = postMeta.title;
            if (postMeta.thumbnail) {
                this.setInnerHtml(newPageDocument.getElementById('post-thumbnail'),
                    `<img src="/img/${postMeta.thumbnail}" alt="${postMeta.title}" class="img-fluid" width="1200"/>`);
                this.setInnerHtml(loopDocument.getElementsByClassName('post-thumbnail')[0],
                    `<img src="/img/${postMeta.thumbnail}" alt="${postMeta.title}" class="img-fluid" width="530"/>`);

                const fullyQualifiedImage = `${siteConfig.root}/img/${postMeta.thumbnail}`;
                this.setMetaContent(newPageDocument, 'metaImage', fullyQualifiedImage);
                this.setStructuredData(structuredData, 'image', [
                    fullyQualifiedImage
                ]);
            } else {
                this.setInnerHtml(newPageDocument.getElementById('post-thumbnail'), '');
                this.setInnerHtml(loopDocument.getElementsByClassName('post-thumbnail')[0], '');
                this.setMetaContent(newPageDocument, 'metaImage', '');
            }

            this.setMetaContent(newPageDocument, 'metaTitle', postMeta.title);
            this.setStructuredData(structuredData, 'headline', postMeta.title);
            this.setInnerHtml(loopDocument.getElementsByClassName('post-title')[0], postMeta.title);
            loopDocument.getElementsByClassName('post-link')[0].href = `/${siteConfig.output}/${postMeta.file}`

            this.setMetaContent(newPageDocument, 'metaDescription', postMeta.excerpt);
            this.setMetaContent(newPageDocument, 'metaUrl', fullyQualifiedUrl);
            this.setStructuredData(structuredData, 'mainEntityOfPage', fullyQualifiedUrl);

            this.setMetaContent(newPageDocument, 'metaPublishedTime', publishDate);
            this.setStructuredData(structuredData, 'datePublished', publishDate);
            this.setInnerHtml(loopDocument.getElementsByClassName('post-date')[0], postMeta.postDate);

            if (!postMeta.updateDate) postMeta.updateDate = postMeta.postDate;
            const updateDate = new Date(postMeta.updateDate).toISOString();
            this.setMetaContent(newPageDocument, 'metaModifiedTime', updateDate);
            this.setStructuredData(structuredData, 'dateModified', updateDate);

            this.setMetaContent(newPageDocument, 'metaTag', postMeta.tags);
            this.setStructuredData(structuredData, 'keywords', postMeta.tags.split(', '));

            this.setInnerHtml(loopDocument.getElementsByClassName('post-author')[0], postMeta.author.name);
            this.setInnerHtml(loopDocument.getElementsByClassName('post-excerpt')[0], postMeta.excerpt);

            this.postsMeta.push(postMeta);

            // push structured data to body
            const structuredDataTag = newPageDocument.createElement("script");
            structuredDataTag.type = "application/ld+json";
            structuredDataTag.innerHTML = JSON.stringify(structuredData, null, 2);
            newPageDocument.getElementsByTagName("body")[0].appendChild(structuredDataTag);

            const completeHtml = this.createRootHtml(newPageDocument.documentElement.innerHTML);
            fs.writeFileSync(`./${siteConfig.output}/${file}`, completeHtml);

            //update pure css
            dropCss({
                css: this.css,
                html: completeHtml
            }).sels.forEach(sel => this.cssWhitelist.add(sel));

            //add to homepage html

            this.homePageHtml += loopDocument.getElementsByTagName('body')[0].innerHTML;

            this.siteMap += `<url>
<loc>${fullyQualifiedUrl}</loc>
<lastmod>${new Date(postMeta.updateDate).toISOString()}</lastmod>
<priority>0.80</priority>
</url>`;
        });

        this.postsMeta = this.postsMeta
            .sort((a, b) => {
                return +new Date(a.postDate) > +new Date(b.postDate) ? -1 : 0;
            });

        fs.writeFileSync(`./js/search.json`, JSON.stringify(this.postsMeta, null, 2));

        this.updateSiteMap();
        this.updateHomepage();
        this.cleanCss();
    }

    updateHomepage() {
        const indexDocument = new JSDOM(fs.readFileSync(`./build/templates/index.html`, 'utf8')).window.document;
        indexDocument.getElementById('post-container').innerHTML = this.homePageHtml;

        const shell = this.shellDocument;
        shell.getElementById('mainContent').innerHTML = indexDocument.documentElement.innerHTML;

        const script = shell.createElement('script');
        script.type = "module"
        script.innerHTML = "import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';";

        shell.getElementsByTagName('head')[0].appendChild(script);

        const el = shell.createElement('pwa-update');
        shell.body.appendChild(el);

        const completeHtml = this.createRootHtml(shell.documentElement.innerHTML);
        fs.writeFileSync(`./index.html`, completeHtml);
        dropCss({
            css: this.css,
            html: completeHtml
        }).sels.forEach(sel => this.cssWhitelist.add(sel));
    }

    update404() {
        const indexDocument = new JSDOM(fs.readFileSync(`./build/templates/404.html`, 'utf8')).window.document;
        const shell = this.shellDocument;
        shell.getElementById('mainContent').innerHTML = indexDocument.documentElement.innerHTML;

        const completeHtml = this.createRootHtml(shell.documentElement.innerHTML);
        fs.writeFileSync(`./404.html`, this.createRootHtml(shell.documentElement.innerHTML));
        dropCss({
            css: this.css,
            html: completeHtml
        }).sels.forEach(sel => this.cssWhitelist.add(sel));
    }

    updateSiteMap() {
        this.siteMap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
<loc>${siteConfig.root}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<priority>1.00</priority>
</url>
${this.siteMap}
</urlset>`;
        fs.writeFileSync(`./sitemap.xml`, this.siteMap);
    }

    updateCss() {
        this.prepareCss();

        const gatherCss = (fullPath) => {
            const postDocument = new JSDOM(fs.readFileSync(fullPath, 'utf8')).window.document;
            dropCss({
                css: this.css,
                html: postDocument.documentElement.innerHTML
            }).sels.forEach(sel => this.cssWhitelist.add(sel));
        }

        fs
            .readdirSync('./build/partials')
            .filter(file => path.extname(file).toLowerCase() === '.html')
            .map(file => `./build/partials/${file}`).forEach(gatherCss);

        fs
            .readdirSync('./build/templates')
            .filter(file => path.extname(file).toLowerCase() === '.html')
            .map(file => `./build/templates/${file}`).forEach(gatherCss);

        this.cleanCss();
    }

    cleanCss() {
        let cleaned = dropCss({
            html: '',
            css: this.css,
            shouldDrop: sel => !this.cssWhitelist.has(sel),
        });
        fs.writeFileSync(`./css/style.min.css`, new cleanCSS().minify(cleaned.css).styles);
    }

    async minifyJs() {
        const loopDocument = new JSDOM(this.postLoopTemplate).window.document;
        const getJs = () => {
            let output = '';

            const files = fs
                .readdirSync('./build/js')
                .filter(file => path.extname(file).toLowerCase() === '.js' && !file.includes('.min.'));

            files.forEach(file => {
                output += fs.readFileSync(`./build/js/${file}`, 'utf8') + '\r\n';
            });

            return output;
        }

        const js = getJs().replace('[POSTLOOP]', loopDocument.getElementsByTagName('body')[0].innerHTML);

        const uglified = await minify(js);

        fs.writeFileSync('./js/bundle.min.js', uglified.code);
    }

    setInnerHtml(element, value) {
        if (!element) return;
        element.innerHTML = value;
    }
}

const formatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
});

const log = (message) => {
    console.log(`[Make ${formatter.format(new Date())}] ${message}`)
}

/**
 * Site configuration
 * @type {object}
 * @property {string} root - Base url for the site.
 * @property {string} output - Where the built partials will go.
 */
const siteConfig = JSON.parse(fs.readFileSync(`./build/site-config.json`, 'utf8'));

log('Building..')
const builder = new Build();
builder.updateAll()

//todo could allow root site or a config file or something
if (process.argv.slice(2)[0] === '--watch') {
    const watcher = chokidar.watch(['build/partials', 'build/styles', 'build/templates', 'build/js'], {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        //ignored: /(^|[\/\\])\..|make\.js|browser-sync-config\.js/g, // ignore dotfiles
        ignoreInitial: true
    });

    let lastChange = '';
    let lastChangeFile = '';

    const handleChange = (event, path) => {
        log(`${event}: ${path}`);
        if (path.startsWith('build\\partials')) {
            //reading the file stats seems to trigger this twice, so if the same file changed in less then a second, ignore
            if (lastChange === formatter.format(new Date()) && lastChangeFile === path) return;
            builder.updatePosts();
        }
        if (path.startsWith('build\\styles')) {
            builder.updateCss();
        }
        if (path.startsWith('build\\templates')) {
            builder.updateAll();
        }
        if (path.startsWith('build\\js')) {
            builder.minifyJs().then();
        }
        log('Update successful');
        lastChange = formatter.format(new Date());
        lastChangeFile = path;
        console.log('');
    }

    watcher
        .on('all', handleChange)
        .on('ready', () => console.log('[Make] Watching files...'));
}