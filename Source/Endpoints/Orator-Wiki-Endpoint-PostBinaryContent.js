// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Orator Wiki Endpoint - Serve Static Content
*
* @function oratorWikiPostBinaryContent
*/
var oratorWikiPostBinaryContent = function(pOrator, fCallBack)
{
	libOrator.webServer.post
	(
		/\/content\/(.*)/,
		function(pRequest, pResponse, fNext)
		{
			var tmpNext = (typeof(fNext) === 'function') ? fNext : function() {};

			var tmpFileName = libOrator.settings.ContentPrefix+pRequest.params.Hash

			libOrator.log.trace('Content Upload', {FileName:tmpFileName, ContentType:pRequest.contentType})
			var tmpContentType = pRequest.header('Content-Type');

			var tmpStream = libFS.createWriteStream(tmpFileName);
			pRequest.pipe(tmpStream);
			pRequest.once
			(
				'end',
				function ()
				{
					libOrator.log.info('Content Uploaded', {FileName:tmpFileName, ContentType:pRequest.contentType});
					return tmpNext();
				}
			);
		}
	);

	return fCallback;
};

module.exports = oratorWikiPostBinaryContent;