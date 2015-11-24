// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libAsync = require('async');

/**
* Orator Wiki Endpoint - Post Wiki Content
*
* @function oratorWikiPostWikiContent
*/
var oratorWikiPostWikiContent = function(pOrator, fCallBack)
{
	pOrator.webServer.post
	(
		'Content',
		function(pRequest, pResponse, fNext)
		{
			var tmpNext = (typeof(fNext) === 'function') ? fNext : function() {};

			var tmpFileName = pOrator.settings.ContentPrefix+pRequest.body.File

			pOrator.log.trace('Content Upload', {FileName:tmpFileName});

			libFS.writeFile(tmpFileName, pRequest.body.Content, { flag:'w+', encoding:'utf8' },
				function(pError)
				{
					if (pError)
					{
						pOrator.log.info('Content Upload Failed', {FileName:tmpFileName, Error:pError});
						pResponse.send({Success:false});
						return tmpNext();
					}
					else
					{
						pOrator.log.info('Content Uploaded', {FileName:tmpFileName});
						pResponse.send({Success:true});
						return tmpNext();
					}
				}
			);
		}
	);

	return fCallback;
};

module.exports = oratorWikiPostWikiContent;