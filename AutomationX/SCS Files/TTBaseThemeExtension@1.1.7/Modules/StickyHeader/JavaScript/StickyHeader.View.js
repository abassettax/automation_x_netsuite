define('Tavanoteam.StickyHeader.StickyHeader.View'
,	[
		'tavanoteam_ttbasethemeextension_stickyheader.tpl'
	,	'Utils'
	,	'Backbone'
	,   'SC.Configuration'
	,	'jQuery'
	,	'underscore'
	
	,	'Header.MiniCart.View'
	,	'Header.MiniCartSummary.View'
	,	'Header.Logo.View'
	,	'Header.Menu.View'

	// ,	'Header.Profile.View'
	// ,	'GlobalViews.HostSelector.View'
	// ,	'GlobalViews.CurrencySelector.View'


	]
,	function (
		tavanoteam_ttbasethemeextension_stickyheader_tpl
	,	Utils
	,	Backbone
	,	Configuration
	,	jQuery
	,	_

	,	HeaderMiniCartView
	,	HeaderMiniCartSummaryView
	,	HeaderLogoView
	,	HeaderMenuView

	// ,	HeaderProfileView
	// ,	GlobalViewsHostSelectorView
	// ,	GlobalViewsCurrencySelectorView

	)
{
	'use strict';

	return Backbone.View.extend({

		template: tavanoteam_ttbasethemeextension_stickyheader_tpl

	,	initialize: function (options) {
			this.options = options;
			this.application = options.container;
			this.headerData = options.headerData;
		}

	,	events: {
		}

	,	bindings: {
		}

	,	childViews: {
			'Header.MiniCart': function() {
				return new HeaderMiniCartView();
			}
			,'Header.MiniCartSummary': function() {
				return new HeaderMiniCartSummaryView();
			}
			,'Header.Logo': function() {
				// Sticky header Logo
				var stickyHeaderLogoUrl = this.headerData.ttStickyHeader.logoUrl;
				if(!!stickyHeaderLogoUrl) {
					_.extend(HeaderLogoView.prototype, {
						getContext: _.wrap(HeaderLogoView.prototype.getContext, function (fn) {
							var result = fn.apply(this, _.toArray(arguments).slice(1));
							result.logoUrl = stickyHeaderLogoUrl;
							return result;
						})
					});
				}
				return new HeaderLogoView(this.options);
			}
			,'Header.Menu': function() {
				var header_view_options = _.extend(
					{
						application: this.application
					},
					this.options.headerProfileViewOptions || {}
				);
				return new HeaderMenuView(header_view_options);
			}
			// ,'Global.HostSelector': function() {
			// 	return new GlobalViewsHostSelectorView();
			// }
			// ,'Global.CurrencySelector': function() {
			// 	return new GlobalViewsCurrencySelectorView();
			// }
			// ,'Header.Profile': function() {
			// 	const password_protected_site = SC.ENVIRONMENT.siteSettings.siteloginrequired === 'T';
			// 	const isLoggedIn = ProfileModel.getInstance().get('isLoggedIn') === 'T';
			// 	if (!password_protected_site || isLoggedIn) {
			// 		const header_profile_view_options = _.extend(
			// 			{
			// 				showMyAccountMenu: true,
			// 				application: this.application
			// 			},
			// 			this.options.headerProfileViewOptions || {}
			// 		);
			// 		return new HeaderProfileView(header_profile_view_options);
			// 	}
			// 	return null;
			// }
		}
		
	,	getContext: function getContext()
		{
			return this.headerData;
		}
	});
});