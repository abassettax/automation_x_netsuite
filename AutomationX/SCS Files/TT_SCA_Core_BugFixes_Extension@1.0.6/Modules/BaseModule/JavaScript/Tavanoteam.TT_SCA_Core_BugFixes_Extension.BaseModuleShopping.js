
define(
	'Tavanoteam.TT_SCA_Core_BugFixes_Extension.BaseModuleShopping'
	, [
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.SiteSearch.View',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.Layout',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.LogoUrl.View',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.QuantityPricing.View',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.BaseSmartMerch',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.QuickAddToCart'
	]
	, function (
		TavanoteamTTSCACoreBugFixesSiteSearchView,
		TavanoteamTTSCACoreBugFixesLayout,
		TavanoteamTTSCACoreBugFixesLogoUrlView,
		TavanoteamTTSCACoreBugQuantityPricingView,
		TavanoteamTTSCACoreBugBaseSmartMerch,
		TavanoteamTTSCACoreBugFixesQuickAddToCart
	) {
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			// console.log('Loading SCA Core BugFixes Modules for Shopping.....');

			TavanoteamTTSCACoreBugFixesLayout.loadModule(container);
			TavanoteamTTSCACoreBugFixesSiteSearchView.loadModule(container);
			TavanoteamTTSCACoreBugFixesLogoUrlView.loadModule(container);
			TavanoteamTTSCACoreBugBaseSmartMerch.loadModule(container);
			TavanoteamTTSCACoreBugFixesQuickAddToCart.loadModule(container);

			// TavanoteamTTSCACoreBugQuantityPricingView
		}
	};
});
