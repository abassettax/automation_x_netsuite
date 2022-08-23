
define(
	'Tavanoteam.TTBaseThemeExtension.SmartMerchand'
	, [
		'SmartMerchand.View'
	]
	, function (
		SmartMerchandView
	) {
		'use strict';

		return {
			loadModule: function loadModule(container) {

				// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.SmartMerchand.....');

				container.getComponent('CMS').registerCustomContentType({

					
					// this property value MUST be lowercase
					id: 'cct_tt_smart_merchand'

					,options : {
						container : container
					}

					// The view to render the CCT   
					, view: SmartMerchandView
				});
			}
		};
	});
