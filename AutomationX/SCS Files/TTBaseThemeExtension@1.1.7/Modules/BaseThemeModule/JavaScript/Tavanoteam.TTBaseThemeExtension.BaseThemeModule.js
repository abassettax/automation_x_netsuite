
define(
	'Tavanoteam.TTBaseThemeExtension.BaseThemeModule'
	, [
		'Tavanoteam.TTBaseThemeExtension.HeaderNavigation.View',
		'Tavanoteam.TTBaseThemeExtension.StickyHeader',
		'Tavanoteam.TTBaseThemeExtension.Footer',
		'Tavanoteam.TTBaseThemeExtension.FixedBackToTop',
		'SC.Configuration'
	]
	, function (
		TavanoteamTTBaseThemeExtensionHeaderNavigationView,
		TavanoteamTTBaseThemeExtensionStickyHeader,
		TavanoteamTTBaseThemeExtensionFooter,
		TavanoteamTTBaseThemeExtensionFixedBackToTop,
		Configuration
	) {
		'use strict';
		
		return {
			mountToApp: function mountToApp(container) {

				if (Configuration.get('ttbasetheme.allowExtension')) {
					// console.log('Loading Base Theme Extension Modules only for MyAccount and Checkout...');

					//TODO: Evaluate from Configuration to load module
					if (Configuration.get('ttbasetheme.footer')) {
						TavanoteamTTBaseThemeExtensionFooter.loadModule(container);
					}

					TavanoteamTTBaseThemeExtensionStickyHeader.loadModule(container);

					if (Configuration.get('ttbasetheme.fixedbacktotop')) {
						TavanoteamTTBaseThemeExtensionFixedBackToTop.loadModule(container);
					}
				}
			}
		};
	});
