// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Simple Orator Wiki Server
*/
// Build the server settings
var libOrator = require('orator').new(
	{
		Product: 'OratorWiki',
		ProductVersion: require(__dirname+'/../package.json').version,

		"APIServerPort": 8080,

		WikiContentFolder: __dirname+'/../Site/Content/',
		StaticContentFolder:__dirname+'/../Site/Html/'
	});

var libOratorWiki = require('./Orator-Wiki.js').new(libOrator);
libOratorWiki.initializeEndpoints();

libOrator.startWebServer();