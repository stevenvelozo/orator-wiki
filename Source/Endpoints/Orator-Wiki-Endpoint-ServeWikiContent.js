// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libAsync = require('async');

/**
* Orator Wiki Endpoint - Serve Wiki Content
*
* @function oratorWikiServeWikiContent
*/
var oratorWikiServeWikiContent = function(pOrator, fCallBack)
{
	pOrator.webServer.get
	(
		/\/content\/(.*)/,
		function(pRequest, pResponse, fNext)
		{
			// The split removes query string parameters.  This makes them effectively ignored by our static web server.
			pRequest.url = pRequest.url.split("?")[0].substr('/content/'.length);
			pRequest.path = function() { return pRequest.url; };
			pOrator.log.trace('Serving wiki content: '+pRequest.url);
			var tmpServe = libRestify.serveStatic(
				{
					directory: pOrator.settings.WikiContentFolder,
					default: pOrator.settings.WikiDefaultFile,
					maxAge: pOrator.settings.WikiMaxAge
				}
			);
			tmpServe(pRequest, pResponse, fNext);
		}
	);

	return fCallback();
};

module.exports = oratorWikiServeWikiContent;