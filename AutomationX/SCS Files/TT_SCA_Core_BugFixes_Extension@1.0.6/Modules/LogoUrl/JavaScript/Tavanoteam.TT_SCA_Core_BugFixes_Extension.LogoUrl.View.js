// @module Tavanoteam.TT_SCA_Core_BugFixes_Extension.LogoUrl
define('Tavanoteam.TT_SCA_Core_BugFixes_Extension.LogoUrl.View'
	, [
		'underscore'
		, 'Header.Logo.View'
		, 'SC.Configuration'
	]
	, function (
		_
		, HeaderLogoExtension
		, Configuration
	) {
		'use strict';

		return {

			loadModule: function loadModule(container) {
	
				// console.log('Loading modules - Tavanoteam.SCA_Core_BugFixes.LogoUrl.....');

				// Logo Url Fix Extension
				_.extend(HeaderLogoExtension.prototype, {
					getContext: _.wrap(HeaderLogoExtension.prototype.getContext, function (fn) {
						var result = fn.apply(this, _.toArray(arguments).slice(1));
						result.logoUrl = Configuration.get('header.logoUrl');
						return result;
					})
				});
			}

		};
	});
