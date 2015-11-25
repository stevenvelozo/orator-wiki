// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libRestify = require('restify');

/**
* Orator Wiki Endpoint - Serve Static Content
*
* @function oratorWikiServeStaticContent
*/
var oratorWikiServeStaticContent = function(pOrator, fCallBack)
{
	var tmpCallback = (typeof(fCallback) === 'function') ? fCallback : function() {};

	pOrator.webServer.get
	(
		/\/.*/,
		function(pRequest, pResponse, fNext)
		{
			// The split removes query string parameters.  This makes them effectively ignored by our static web server.
			pRequest.url = pRequest.url.split("?")[0].substr('/'.length);
			pRequest.path = function() { return pRequest.url; };
			pOrator.log.trace('Serving content: '+pRequest.url);
			var tmpServe = libRestify.serveStatic(
				{
					directory: pOrator.settings.StaticContentFolder,
					default:'index.html',
					maxAge: 0
				}
			);
			tmpServe(pRequest, pResponse, fNext);
		}
	);

	return tmpCallback();
};

module.exports = oratorWikiServeStaticContent;