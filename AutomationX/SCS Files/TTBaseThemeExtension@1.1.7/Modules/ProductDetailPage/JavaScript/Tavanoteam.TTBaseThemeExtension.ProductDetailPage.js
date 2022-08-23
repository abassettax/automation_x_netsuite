
define(
	'Tavanoteam.TTBaseThemeExtension.ProductDetailPage'
	, [
		'Tavanoteam.TTBaseThemeExtension.ProductDetailPage.View',
		'Tavanoteam.TTBaseThemeExtension.ProductListPage.View'

	]
	, function (

		ProductDetailPageView,
		ProductListPageView

	) {
		'use strict';

		return {

			loadModule: function loadModule(container) {

				// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.Pricing.....');

				var pdp = container.getComponent('PDP');

				var plp = container.getComponent('PLP');

				if (plp) {

					plp.removeChildView('ProductViewsPrice.Price');
					plp.addChildView('Extension.Price', function () {
						return new ProductListPageView({ plp: plp });
					});
				}

				if (pdp) {

					//PDP Full View
					pdp.removeChildView('Product.Price');
					pdp.addChildView('Extension.Price', function () {
						return new ProductDetailPageView({ pdp: pdp });
					});

					//PDP Quick View - Optional
					//if (Configuration.get('ttbasetheme.quickView')) {
					pdp.removeChildView(pdp.PDP_QUICK_VIEW, 'Product.Price', 'Product.Price');
					pdp.addChildViews(
						pdp.PDP_QUICK_VIEW, {
							'Extension.Price': {
								'pricePDPQV': {
									childViewIndex: 10,
									childViewConstructor: function childViewConstructor() {
										return new ProductDetailPageView({
											pdp: pdp
										});
									}
								}
							}
						}
					);
					//}
				}
			}
		};
	});
