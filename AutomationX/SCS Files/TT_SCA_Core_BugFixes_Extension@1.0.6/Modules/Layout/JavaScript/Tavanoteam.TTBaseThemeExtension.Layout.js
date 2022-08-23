
define(
	'Tavanoteam.TT_SCA_Core_BugFixes_Extension.Layout'
	, [
		'jQuery'
	]
	, function (
		jQuery

	) {
		'use strict';

		return {

			loadModule: function loadModule(container) {

				// console.log('Loading modules - Tavanoteam.SCA_Core_BugFixes.Layout.....');

				var layout = container.getComponent('Layout');
				
				layout.on('afterShowContent', function (view) {
					if (!view.inModal) {
						var viewName = view;
						viewName = viewName.replace(".View", "");
						jQuery('#layout').removeClass().addClass('layout').addClass('sec_' + viewName);
					}
				});

				return '';

			}

		};
	});
