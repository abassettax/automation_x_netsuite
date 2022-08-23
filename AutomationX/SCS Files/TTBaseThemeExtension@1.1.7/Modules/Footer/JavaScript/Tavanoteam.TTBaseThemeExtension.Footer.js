
define(
	'Tavanoteam.TTBaseThemeExtension.Footer'
	, [
		'SC.Configuration'
	]
	, function (
		Configuration
	) {
		'use strict';

		return {

			loadModule: function loadModule(container) {

				var actualYear = new Date().getFullYear();
				var copyright = Configuration.get('ttbasetheme.copyright');

				// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.Footer.....');

				var layout = container.getComponent('Layout');

				// Normal Footer
				layout.addToViewContextDefinition('Footer.View', 'actualYear', 'string', function (context) {
					return actualYear;
				});

				layout.addToViewContextDefinition('Footer.View', 'copyright', 'string', function (context) {
					return copyright;
				});

				// Footer Simplified
				if (layout.application.name == 'Checkout') {

					layout.addToViewContextDefinition('Footer.Simplified.View', 'actualYear', 'string', function (context) {
						return actualYear;
					});

					layout.addToViewContextDefinition('Footer.Simplified.View', 'copyright', 'string', function (context) {
						return copyright;
					});
				}

			}

		};
	});
