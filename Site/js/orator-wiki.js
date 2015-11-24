// TODO: Modularize this sucker.
var libFS = require('fs')

var OratorWiki = {};

// Extend jquery with a sweeping motion
$.fn.scrollView = function ()
{
	return this.each(
		function ()
		{
			$('html, body').animate(
				{
					scrollTop: $(this).offset().top-75
				},
				700
			);
		}
	);
};

marked.setOptions({gfm: true});

OratorWiki.initialize = function(pOrator, fComplete)
{
	// Serve static wiki content
	libOrator.webServer.get
	(
		/\/content\/(.*)/,
		function(pRequest, pResponse, fNext)
		{
			console.log('Content: '+pRequest.url)
			// The split removes query string parameters.  This makes them effectively ignored by our static web server.
			pRequest.url = pRequest.url.split("?")[0].substr('/content/'.length);
			pRequest.path = function() { return pRequest.url; };
			libOrator.log.trace('Serving wiki content: '+pRequest.url);
			var tmpServe = libRestify.serveStatic(
				{
					directory: libOrator.settings.ContentPrefix,
					default:'index.md',
					maxAge: 0
				}
			);
			tmpServe(pRequest, pResponse, fNext);
		}
	);

	// Allow users to post text articles as JSON blobs
	pOrator.webServer.post
	(
		'Content',
		function(pRequest, pResponse, fNext)
		{
			var tmpNext = (typeof(fNext) === 'function') ? fNext : function() {};

			var tmpFileName = libOrator.settings.ContentPrefix+pRequest.body.File

			libOrator.log.trace('Content Upload', {FileName:tmpFileName});

			libFS.writeFile(tmpFileName, pRequest.body.Content, { flag:'w+', encoding:'utf8' },
				function(pError)
				{
					if (pError)
					{
						libOrator.log.info('Content Upload Failed', {FileName:tmpFileName, Error:pError});
						pResponse.send({Success:false});
						return tmpNext();
					}
					else
					{
						libOrator.log.info('Content Uploaded', {FileName:tmpFileName});
						pResponse.send({Success:true});
						return tmpNext();
					}
				}
			);
		}
	);
/*
// Serve static lists for the file upload/download
libOrator.webServer.post
(
	'List',
	function(pRequest, pResponse, fNext)
	{
		var tmpFolder = (typeof(pRequest.body.Folder) === 'undefined') ? libOrator.settings.ContentPrefix : libOrator.settings.ContentPrefix+pRequest.body.Folder;

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
libOrator.webServer.post
(
	'Content/:Hash',
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
*/
}

OratorWiki.parseContent = function(pContent)
{
	return marked(pContent.replace
		( // Generate links that scroll to an HREF
			/\{([A-Za-z0-9 \-\/]+)\|([A-Za-z0-9 \:\.\/\,\'\-\(\)]+)\>([A-Za-z0-9\-]+)\}/g,
			"<a href=\"#To/$3/$1\">$2</a>"
		).replace
		( // Generate links
			/\{([A-Za-z0-9 \-\/]+)\|([A-Za-z0-9 \:\.\/\,\'\-\(\)]+)\}/g,
			"<a href=\"#$1\">$2</a>"
		));
};

// Global state of the current content
OratorWiki.CurrentContent = '';

// Create a simple content-from-markdown grabber
OratorWiki.getContent = function(pContentHash, fComplete)
{
	var tmpComplete = (typeof(fComplete) === 'function') ? fComplete : function(){};
	var tmpContentHash = (typeof(pContentHash) === 'string') ? pContentHash : 'DocumentationIndex';
	// Load the main page, which is hand-built
	$.ajax
	(
		{
			type: 'GET',
			url: '/content/'+tmpContentHash+'.md',
			datatype: 'text/plain'
		}
	)
	.done
	(
	  function (pData)
		{
			if (!pData)
				return false;

			// Load up the template for our content editor
			if (typeof(OratorWiki.contentRenderTemplate) === 'undefined')
				OratorWiki.contentRenderTemplate = _.template($('#Orator_Wiki_Content').text());
			
			$('#OratorWikiContent').html(OratorWiki.contentRenderTemplate({Hash:tmpContentHash, Content:pData, ParsedContent:OratorWiki.parseContent(pData)}));
			OratorWiki.CurrentContent = tmpContentHash;
			$('#OratorWikiContentEditor').html('');

			tmpComplete();
		}
	);
	// TODO: FAIL MESSAGES?  I SENSE AN ARMADILLO COMING.
};

OratorWiki.pushContent = function(pContent, fComplete)
{
	var tmpComplete = (typeof(fComplete) === 'function') ? fComplete : function(){};
	var tmpContent = pContent;

	console.log('Pushing content to server: '+tmpContent.Hash);

	$.ajax
	(
		{
			type: 'POST',
			url: '/Content',
			datatype: 'application/json',
			data: tmpContent
		}
	)
	.done
	(
		function (pData)
		{
			tmpComplete();
		}
	);
};

// Create a simple content-from-markdown grabber
OratorWiki.getContentEditor = function(pContentHash, fComplete)
{
	var tmpComplete = (typeof(fComplete) === 'function') ? fComplete : function(){};
	var tmpContentHash = (typeof(pContentHash) === 'string') ? pContentHash : 'DocumentationIndex';

	$.ajax
	(
		{
			type: 'GET',
			url: '/content/'+tmpContentHash+'.md',
			datatype: 'text/plain'
		}
	)
	.done
	(
		function (pData)
		{
			if (!pData)
				return false;

			// Load up the template for our content editor
			if (typeof(OratorWiki.contentEditorTemplate) === 'undefined')
				OratorWiki.contentEditorTemplate = _.template($('#Orator_Wiki_Content_Editor').text());
			
			$('#OratorWikiContent').html('');
			$('#OratorWikiContentEditor').html(OratorWiki.contentEditorTemplate({Hash:tmpContentHash, Content:pData}));

			// Now make the markdown editor magic happen
			var tmpMarkdownEditor = new EpicEditor(
				{
					container: 'Orator_Wiki_Markdown_Editor',
					textarea: 'Orator_Wiki_Content',
					basePath: 'dependencies/js/epiceditor',
					clientSideStorage: false,
					localStorageName: 'Orator_Wiki',
					useNativeFullscreen: false,
					parser: OratorWiki.parseContent,
					file:
					{
						name: 'epiceditor',
						defaultContent: '',
						autoSave: 100
					},
					theme:
					{
						base: '/themes/base/epiceditor.css',
						preview: '/themes/preview/github.css',
						editor: '/themes/editor/epic-dark.css'
					},
					button:
					{
						preview: true,
						fullscreen: true,
						bar: "auto"
					},
					focusOnLoad: true,
					shortcut:
					{
						modifier: 18,
						fullscreen: 70,
						preview: 80
					},
					string:
					{
						togglePreview: 'Toggle Preview Mode',
						toggleEdit: 'Toggle Edit Mode',
						toggleFullscreen: 'Enter Fullscreen'
					},
					autogrow: false
				}).load();

			// Wire up the save button
			$('#Orator_Wiki_Content_Form').submit(
				function(pEvent)
				{
					var tmpArticle = (
						{
							Hash:$('#Orator_Wiki_Hash').val(),
							File:$('#Orator_Wiki_Hash').val()+'.md',
							Content:$('#Orator_Wiki_Content').val()
						});
					OratorWiki.pushContent(
						tmpArticle,
						function()
						{
							console.log('Content pushed!')
							// Once the save is complete, load the article
							OratorWiki.Router.navigate(tmpArticle.Hash, { trigger: true });
						}
					);
					pEvent.preventDefault();
				}
			);

			tmpComplete();
		}
	);
};

OratorWiki.displayContent = function(pContentHash)
{
	console.log('Showing  content: '+pContentHash);
	OratorWiki.getContent(pContentHash,
		function ()
		{
			$('#OratorWikiContent').scrollView();
		});
};

OratorWiki.displayContentWithAnchor = function(Anchor, pContentHash)
{
	if (OratorWiki.CurrentContent !== pContentHash)
	{
		console.log('Showing content: '+pContentHash);
		OratorWiki.getContent(pContentHash,
			function ()
			{
				console.log('Scrolling to anchor: '+Anchor);
				// Scroll to the content anchor after loading the markdown content
				$('#'+Anchor).scrollView()
			});
	}
	else
	{
		console.log('Scrolling to anchor: '+Anchor);
		// Scroll to the content anchor
		$('#'+Anchor).scrollView()
	}
};

OratorWiki.displayContentEditor = function(pContentHash)
{
	console.log('Showing content editor: '+pContentHash);
	OratorWiki.getContentEditor(pContentHash,
		function ()
		{
			$('#OratorWikiContent').scrollView();
		});
};

OratorWiki.RouterPrototype = Backbone.Router.extend
({
	routes:
	{
		"To/:Anchor/*a": OratorWiki.displayContentWithAnchor,
		"Edit/*a": OratorWiki.displayContentEditor,
		"*a": OratorWiki.displayContent
	}
});
OratorWiki.Router = new OratorWiki.RouterPrototype();

Backbone.history.start();
