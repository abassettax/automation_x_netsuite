
define(
	'Tavanoteam.TTBaseThemeExtension.BaseThemeModuleShopping'
	, [
		'Tavanoteam.TTBaseThemeExtension.HeaderNavigation.View',
		'Tavanoteam.TTBaseThemeExtension.StickyHeader',
		'Tavanoteam.TTBaseThemeExtension.Footer',
		
		'SC.Configuration',

		'Tavanoteam.TTBaseThemeExtension.ProductDetailPage',
		'Tavanoteam.TTBaseThemeExtension.SmartMerchand',
		'Tavanoteam.TTBaseThemeExtension.Slider',
		'Tavanoteam.TTBaseThemeExtension.Banner',
		'Tavanoteam.TTBaseThemeExtension.FacetsManager',
		'Tavanoteam.TTBaseThemeExtension.FacetsItemInfo',
		'Tavanoteam.TTBaseThemeExtension.AnchorScroll',
		'Tavanoteam.TTBaseThemeExtension.LazyLoading',
		'Tavanoteam.TTBaseThemeExtension.FixedBackToTop'
	]
	, function (
		TavanoteamTTBaseThemeExtensionHeaderNavigationView,
		TavanoteamTTBaseThemeExtensionStickyHeader,
		TavanoteamTTBaseThemeExtensionFooter,

		Configuration,

		TavanoteamTTBaseThemeExtensionProductDetailPage,
		TavanoteamTTBaseThemeExtensionSmartMerchand,
		TavanoteamTTBaseThemeExtensionSlider,
		TavanoteamTTBaseThemeExtensionBanner,
		TavanoteamTTBaseThemeExtensionFacetsManager,
		TavanoteamTTBaseThemeExtensionFacetsItemInfo,
		TavanoteamTTBaseThemeExtensionAnchorScroll,
		TavanoteamTTBaseThemeExtensionLazyLoading,
		TavanoteamTTBaseThemeExtensionFixedBackToTop
	) {
		'use strict';
		
		return {
			mountToApp: function mountToApp(container) {

				if (Configuration.get('ttbasetheme.allowExtension')) {
					// console.log('Loading Base Theme Extension Modules for Shopping...');

					//TODO: Evaluate from Configuration to load module
					if (Configuration.get('ttbasetheme.footer')) {
						TavanoteamTTBaseThemeExtensionFooter.loadModule(container);
					}

					//TODO: Evaluate from Configuration to load module
					if (!Configuration.get('ttbasetheme.basePrice') == '') {
						//TODO: Evaluate from Configuration to load module
						if (Configuration.get('ttbasetheme.pricing')) {
							TavanoteamTTBaseThemeExtensionProductDetailPage.loadModule(container);
						}
					}

					//TODO: Evaluate from Configuration to load module
					if (Configuration.get('ttbasetheme.smartMerchand')) {
						TavanoteamTTBaseThemeExtensionSmartMerchand.loadModule(container);
					}

					//TODO: Evaluate from Configuration to load module
					if (Configuration.get('ttbasetheme.slider')) {
						TavanoteamTTBaseThemeExtensionSlider.loadModule(container);
					}

					//TODO: Evaluate from Configuration to load module
					if (Configuration.get('ttbasetheme.banner')) {
						TavanoteamTTBaseThemeExtensionBanner.loadModule(container);
					}

					if (Configuration.get('theme.facet')) {
						TavanoteamTTBaseThemeExtensionFacetsManager.loadModule();
					}

					if (Configuration.get('ttbasetheme.facetsiteminfo')) {
						TavanoteamTTBaseThemeExtensionFacetsItemInfo.loadModule();
					}

					TavanoteamTTBaseThemeExtensionStickyHeader.loadModule(container);
					
					if (Configuration.get('ttbasetheme.lazyloading')) {
						TavanoteamTTBaseThemeExtensionLazyLoading.loadModule(container);
					}

					if (Configuration.get('ttbasetheme.fixedbacktotop')) {
						TavanoteamTTBaseThemeExtensionFixedBackToTop.loadModule(container);
					}
					
					if (window.location.href.indexOf("-local.ssp") < 0) {
						TavanoteamTTBaseThemeExtensionAnchorScroll.loadModule(container);
					}
					
				}
			}
		};
	});
