// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/

/**
* Orator Wiki
*
* @class OratorWiki
*/
var OratorWiki = function()
{
	function createNew(pOrator)
	{
		// If a valid Orator object isn't passed in, return a constructor
		if ((typeof(pOrator) !== 'object') || (!pOrator.hasOwnProperty('webServer')))
		{
			return {new: createNew};
		}
		var _Fable = pOrator.fable;
		var _Orator = pOrator;

		// Make sure there is a valid folder for content and html documentation
		_Fable.settingsManager.fill(
			{
				StaticContentFolder:__dirname+'/Site/Html/',

				WikiContentFolder: __dirname+'/Site/Content/',
				WikiDefaultFile: 'TableOfContents.md',
				WikiMaxAge: 0
			}
		);

		// Wire the endpoints up for the wiki API
		var initializeEndpoints = function(fComplete)
		{
			var tmpCallback = (typeof(fCallback) === 'function') ? fCallback : function() {};

			require(__dirname+'/Endpoints/Orator-Wiki-Endpoint-PostWikiContent.js')(_Orator);


			require(__dirname+'/Endpoints/Orator-Wiki-Endpoint-ServeWikiContent.js')(_Orator);
			require(__dirname+'/Endpoints/Orator-Wiki-Endpoint-ServeStaticContent.js')(_Orator);

			return tmpCallback();
		}

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewOratorWiki = (
		{
			initializeEndpoints: initializeEndpoints,
			new: createNew
		});

		return tmpNewOratorWiki;
	}

	return createNew();
};

module.exports = new OratorWiki();
