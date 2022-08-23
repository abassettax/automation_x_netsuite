define(
	'Tavanoteam.TTBaseThemeExtension.FacetsManager'
	, [
		'SC.Configuration'
	
	]
	, function (

		Configuration
		

	) {
		'use strict';

    return {
        loadModule: function loadModule() {

				var excludedFacet = Configuration.get('theme.fields');
				
				_.extend(Configuration.searchApiMasterOptions.Facets, {
					'facet.exclude': excludedFacet.toString()
				});
				_.extend(Configuration.searchApiMasterOptions.itemsSearcher, {
					'facet.exclude': excludedFacet.toString()
				});
				_.extend(Configuration.searchApiMasterOptions.typeAhead, {
					'facet.exclude': excludedFacet.toString()
				});
				_.extend(Configuration.searchApiMasterOptions.relatedItems, {
					'facet.exclude': excludedFacet.toString()
				});
				_.extend(Configuration.searchApiMasterOptions.correlatedItems, {
					'facet.exclude': excludedFacet.toString()
				});
			}
		};
	});
