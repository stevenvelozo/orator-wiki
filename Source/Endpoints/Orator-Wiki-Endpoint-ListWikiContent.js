// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/
var libFS = require('fs');
var libAsync = require('async');

/**
* Orator Wiki Endpoint - List Wiki Content
*
* @function oratorWikiListWikiContent
*/
var oratorWikiListWikiContent = function(pOrator, fCallBack)
{
	pOrator.webServer.post
	(
		'List',
		function(pRequest, pResponse, fNext)
		{
			var tmpFolder = (typeof(pRequest.body.Folder) === 'undefined') ? pOrator.settings.ContentPrefix : pOrator.settings.ContentPrefix+pRequest.body.Folder;

			var tmpListing = [];

			libAsync.waterfall(
				[
					function (fStageComplete)
					{
						// List all files in the passed-in folder
						libFS.readdir(tmpFolder,
							function(pError, pFiles)
							{
								fStageComplete(pError, pFiles);
							});
					},
					function(pFiles, fStageComplete)
					{
						var tmpFileSet = [];
						libAsync.each(pFiles,
							function(pFile, fCallback)
							{
								libFS.stat(tmpFolder+'/'+pFile,
									function(pError, pFileStats)
									{
										tmpFileSet.push(
										{
											Name: pFile,
											Path: tmpFolder,
											Size: pFileStats.size,
											Directory: pFileStats.isDirectory(),
											Created: pFileStats.birthtime,
											Modified: pFileStats.mtime
										});
										fCallback(pError);
									});
							},
							function (pError)
							{
								fStageComplete(pError, tmpFileSet);
							});
					}
				],
				function(pError, pFileSet)
				{
					if (pError)
					{
						pResponse.send({Folder:tmpFolder, Files: false, Error: pError});
						return fNext();
					}

					pResponse.send({Folder:tmpFolder, Files:pFileSet});
					return fNext();
				});

		}
	);

	return fCallback;
};

module.exports = oratorWikiListWikiContent;