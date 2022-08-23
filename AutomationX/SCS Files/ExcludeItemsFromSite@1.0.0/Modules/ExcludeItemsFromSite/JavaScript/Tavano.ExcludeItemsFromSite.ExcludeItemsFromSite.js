
define(
	'Tavano.ExcludeItemsFromSite.ExcludeItemsFromSite'
	, [
		'SC.Configuration',
		'underscore',
	]
	, function (
		Configuration,
		_

	) {
		'use strict';


		return {
			mountToApp: function mountToApp(container) {
				
				var item = false;
				var excludedFacet = 'custitem71';

				_.extend(Configuration.searchApiMasterOptions.Facets, {
					'facet.exclude': excludedFacet, 'custitem71': item
				});

				_.extend(Configuration.searchApiMasterOptions.itemsSearcher, {
					'facet.exclude': excludedFacet, 'custitem71': item
				});

				_.extend(Configuration.searchApiMasterOptions.typeAhead, {
					'facet.exclude': excludedFacet, 'custitem71': item
				});

				_.extend(Configuration.searchApiMasterOptions.relatedItems, {
					'facet.exclude': excludedFacet, 'custitem71': item
				});

				_.extend(Configuration.searchApiMasterOptions.correlatedItems, {
					'facet.exclude': excludedFacet, 'custitem71': item
				});

				_.extend(Configuration.searchApiMasterOptions.itemDetails, {
					'facet.exclude': excludedFacet, 'custitem71': item
				});

			}
		}
	})

