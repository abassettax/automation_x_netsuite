
define(
	'Tavanoteam.TT_SCA_Core_BugFixes_Extension.BaseModule'
	, [
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.SiteSearch.View',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.Layout',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.LogoUrl.View',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.FooterContentCheckout',
		'Tavanoteam.TT_SCA_Core_BugFixes_Extension.BaseSmartMerch'
	]
	, function (
		TavanoteamTTSCACoreBugFixesSiteSearchView,
		TavanoteamTTSCACoreBugFixesLayout,
		TavanoteamTTSCACoreBugFixesLogoUrlView,
		TavanoteamTTSCACoreBugFixesFooterContentCheckout,
		TavanoteamTTSCACoreBugBaseSmartMerch
	) {
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			console.log('Loading SCA Core BugFixes Modules for My Account & Checkout.....');

			TavanoteamTTSCACoreBugFixesLayout.loadModule(container);
			TavanoteamTTSCACoreBugFixesSiteSearchView.loadModule(container);
			TavanoteamTTSCACoreBugFixesLogoUrlView.loadModule(container);
			TavanoteamTTSCACoreBugBaseSmartMerch.loadModule(container);

			TavanoteamTTSCACoreBugFixesFooterContentCheckout.loadModule(container);
		}
	};
});
