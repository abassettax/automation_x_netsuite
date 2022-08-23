// @module Tavanoteam.TTBaseThemeExtension.Banner

define(
	'Tavanoteam.TTBaseThemeExtension.Banner'
,   [
		'Tavanoteam.TTBaseThemeExtension.Banner.View'
	]
,   function (
		BannerView
	)
{
	'use strict';

	return {
		loadModule: function loadModule(container) {

			// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.Banner.....');


			container.getComponent('CMS').registerCustomContentType({

				// this property value MUST be lowercase
				id: 'cct_tt_banner'

				// The view to render the CCT
				, view: BannerView
			});
		}
	};
});