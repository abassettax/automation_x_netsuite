// @module Tavanoteam.TTBaseThemeExtension.SiteSearch
define('Tavanoteam.TT_SCA_Core_BugFixes_Extension.SiteSearch.View'
,	[
		'jQuery'
	,	'underscore'
	,	'SiteSearch.View'
	]
,	function (
		jQuery
	,	_
	,	SiteSearchView
	)
{
	'use strict';

    return {

        loadModule: function loadModule(container) {

			// console.log('Loading modules - Tavanoteam.SCA_Core_BugFixes.SiteSearch.....');

            _.extend(SiteSearchView.prototype, {
                resetHandle: function() {
                	this.$('[data-type="search-reset"]').hide();
                    this.itemsSearcherComponent.cleanSearch(true);
                },
			})
		}

    };
});