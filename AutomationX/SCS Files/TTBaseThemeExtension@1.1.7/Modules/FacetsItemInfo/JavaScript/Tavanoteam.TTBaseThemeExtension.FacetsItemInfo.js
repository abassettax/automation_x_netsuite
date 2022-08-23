define(
	'Tavanoteam.TTBaseThemeExtension.FacetsItemInfo'
	, [
		'underscore'
		, 'SC.Configuration'
		, 'Facets.ItemCell.View'
	]
	, function (
		_
		, Configuration
		, FacetsItemCellView
	) {
		'use strict';

    	return {

			loadModule: function loadModule() {

				// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.FacetsItemInfo.....');
					
				var configurationData = {};

				if (Configuration.get('ttbasetheme.allowExtension')) {
					configurationData = Configuration.get('ttbasetheme.itemfields');
				}
				
				if(configurationData.length) {

					_.extend(FacetsItemCellView.prototype, {
						getContext: _.wrap(FacetsItemCellView.prototype.getContext, function (fn) {
							
							var result = fn.apply(this, _.toArray(arguments).slice(1));

							var extensionFacetsItemFields = {};
							
							for (var index = 0; index < configurationData.length; index++) {
								if(configurationData[index].enableField === "Yes") {
									extensionFacetsItemFields[configurationData[index].variableName] = this.model.get(configurationData[index].fieldId);
								}
							}

							result.extensionFacetsItemFields = extensionFacetsItemFields;

							return result;
						})
					});

				}
			
			}
		};
	});
