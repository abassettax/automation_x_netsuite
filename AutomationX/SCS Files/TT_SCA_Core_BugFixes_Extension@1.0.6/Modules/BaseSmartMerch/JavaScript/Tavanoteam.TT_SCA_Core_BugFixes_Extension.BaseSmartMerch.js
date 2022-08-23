
define(
	'Tavanoteam.TT_SCA_Core_BugFixes_Extension.BaseSmartMerch'
,   [
		'SC.Configuration',
		'Utils',
		'jQuery'
	]
,   function (
		Configuration,
		Utils,
		jQuery
	)
{
	'use strict';

	return  {
		loadModule: function loadModule(container) {
	
			// console.log('Loading modules - Tavanoteam.SCA_Core_BugFixes.BaseSmartMerch.....');

			Configuration.bxSliderDefaults = {
				minSlides: 1, // fix
				slideWidth: 228,
				maxSlides: 5,
				forceStart: true,
				pager: false,
				touchEnabled: true,
				nextText:
					'<a class="item-relations-related-carousel-next"><span class="control-text">' +
					Utils.translate('next') +
					'</span> <i class="carousel-next-arrow"></i></a>',
				prevText:
					'<a class="item-relations-related-carousel-prev"><i class="carousel-prev-arrow"></i> <span class="control-text">' +
					Utils.translate('prev') +
					'</span></a>',
				controls: true,
				preloadImages: 'all',
				onSliderLoad: function() {
					var itemsCount = jQuery(this).find('li:not(.bx-clone)').length;
					jQuery(this).addClass('tt-basesmartmerch-' + itemsCount + '-items');
				}
			}
		}
	};
});
