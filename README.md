# Orator Wiki

Wiki content server and basic web Content Management System.  Flexible enough to scale into various documentation and learning property uses.  Stores structured content in Markdown format.

[![Code Climate](https://codeclimate.com/github/stevenvelozo/orator-wiki/badges/gpa.svg)](https://codeclimate.com/github/stevenvelozo/orator-wiki) [![Coverage Status](https://coveralls.io/repos/stevenvelozo/orator-wiki/badge.svg?branch=master)](https://coveralls.io/r/stevenvelozo/orator-wiki?branch=master) [![Build Status](https://travis-ci.org/stevenvelozo/orator-wiki.svg?branch=master)](https://travis-ci.org/stevenvelozo/orator-wiki) [![Dependency Status](https://david-dm.org/stevenvelozo/orator-wiki.svg)](https://david-dm.org/stevenvelozo/orator-wiki) [![devDependency Status](https://david-dm.org/stevenvelozo/orator-wiki/dev-status.svg)](https://david-dm.org/stevenvelozo/orator-wiki#info=devDependencies)

## Basic Usage

You can see the content management system "work" without any style by downloading this git repository, then:

```sh
npm install
npm run serve
```
Which will start a basic web server on port 7000, and serve the simplest HTML possible.  The wiki content is served from an adjacent folder.  The markdown is in `Site/Content` by default and the actual web page/dependencies is in `Site/Html`.

## Extending This

The expectation for using this is that it will be extended.  You will want to create a node.js project of your own, and include this as a dependency.

1. *Initialize a project* by running `npm init` from the empty folder you want a project in
2. *Install the Orator dependency* by executing `npm install orator --save` from your project folder
3. *Install the Orator-Wiki dependency* by executing `npm install orator-wiki --save` from your project folder
4. *Create folders for the basic html site and markdown content* with `mkdir Html` and `mkdir Content` from within your project folder
5. *Copy the starter site from the orator-wiki project into your newly created Html folder* by running `cp -R node_modules/orator-wiki/Site/Html/* Html/` from within your project folder
6. *Copy the starter Table of Contents into your newly created Content folder* by running `cp -R node_modules/orator-wiki/Site/Content/* Content/` from within your project folder
7. *Create a basic script to run your site from* by running `touch MyServer.js` from within your project folder

Launch your favorite text editor and put something like this in your MyServer.js file:

```js
var libOrator = require('orator').new(
	{
		Product: 'MyContentServer',
		ProductVersion: require(__dirname+'/package.json').version,

		"APIServerPort": 7777,

		WikiContentFolder: __dirname+'/Content/',
		StaticContentFolder:__dirname+'/Html/'
	});

var libOratorWiki = require('./Orator-Wiki.js').new(libOrator);
libOratorWiki.initializeEndpoints();

libOrator.startWebServer();
```

Then you can start the server by running the following command in your project folder:

```sh
node MyServer.js
```

After that, a browser pointed to (http://localhost:7777) on the machine you run the server from should open a really basic, unstyled wiki content editor.

## Customizing

You can start to make changes to the Html folder to alter how the site looks, and changes to the Content folder to expand on the content.  Markdown will be automatically turned into html by the browser when it is in the Content folder, and binaries will serve properly.

Feel free to go nuts adding other Javascript and CSS libraries, but the ones in the page need to stay for the basic wiki functionality to work.  The bundled [marked](https://github.com/chjj/marked) library is stock, but the orator-wiki.js web file adds a layer to it for parsing out wiki text.

## Wiki Content

To link to other articles in the Content folder, you just use a basic mustache wiki syntax:

* `{MyDocumentTitle}` points to the `MyDocumentTitle.md` file in your content folder.
* `{Some/Path/AppleRecipe}` points to the `Some/Path/AppleRecipe.md` file in the content folder.

You may wish to use different text for links, which can be done with a pipe:

* `{Process/Devs|My Tasks}` points to the `Process/Devs.md` file in the content folder, but displays the link text as `My Tasks` in the browser.
* `{}`

If you want to get very fancy, you can create links that automatically scroll to a specific point in the content.  This is done with a third datapart in the wiki link:

* `{Process/Devs|Workboard Flow and Process>workboard-flow-and-process}` points to the `Process/Devs.md` file in the content folder, displays `Workboard Flow and Process` in the browser and automatically scrolls to the element on the page with the id `workboard-flow-and-process`.  _This is especially handy because the markdown parser automatically creates ids for title elements on the page, so if you create a line in the markdown document that says `#Workboard Flow and Process` this link would scroll down so that line is visible.
