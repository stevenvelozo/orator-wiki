/**
* Unit tests for Orator Wiki
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

suite
(
	'Retold',
	function()
	{
		var _Orator;

		setup
		(
			function()
			{
				_Orator = require('orator').new();
			}
		);


		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'The class should initialize itself into a happy little object.',
					function()
					{
						testOratorWiki = require('../source/Orator-Wiki.js').new(_Orator);
						// Instantiate the logger
						Expect(testOratorWiki).to.be.an('object', 'Retold should initialize as an object directly from the require statement.');
					}
				);
			}
		);
	}
);