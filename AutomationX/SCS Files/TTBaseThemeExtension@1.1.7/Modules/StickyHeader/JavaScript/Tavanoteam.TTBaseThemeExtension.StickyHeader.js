
define(
	'Tavanoteam.TTBaseThemeExtension.StickyHeader'
,   [
		'SC.Configuration'
	,	'jQuery'
	,	'Header.View'
	,	'Tavanoteam.StickyHeader.StickyHeader.View'
	]
,   function (
		Configuration
	,	jQuery
	,	HeaderView
	,	StickyHeaderView
	)
{
	'use strict';

	return {
		loadModule: function loadModule(container) {
			
			var stickyHeaderEnabled = Configuration.get('ttbasetheme.allowStickyHeader');
			
			if(stickyHeaderEnabled) {
				
				// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.StickyHeader.....');
				
				var logoUrl = Configuration.get('ttbasetheme.stickyHeader.logoUrl');
				var logoWidth = Configuration.get('ttbasetheme.stickyHeader.logoWidth');
				var linksPadding = Configuration.get('ttbasetheme.stickyHeader.linksPadding');
				var mediumScreenDisplayOptions = Configuration.get('ttbasetheme.stickyHeader.displayMediumScreen');
				var largeScreenDisplayOptions = Configuration.get('ttbasetheme.stickyHeader.displayLargeScreen');
				
				var cartClass = '';
				var searchClass = '';
				for (var i = 0; i < mediumScreenDisplayOptions.length; i++) {
					cartClass += (mediumScreenDisplayOptions[i] === 'Show Cart' ? 'tt-ext-sticky-header-screen-medium ' : '');
					searchClass += (mediumScreenDisplayOptions[i] === 'Show Search' ? 'tt-ext-sticky-header-screen-medium ' : '');
				}
				for (var i = 0; i < largeScreenDisplayOptions.length; i++) {
					cartClass += (largeScreenDisplayOptions[i] === 'Show Cart' ? 'tt-ext-sticky-header-screen-large ' : '');
					searchClass += (largeScreenDisplayOptions[i] === 'Show Search' ? 'tt-ext-sticky-header-screen-large ' : '');
				}

				logoWidth = logoWidth ? logoWidth : 200;
				logoWidth = 'style="max-width:' + logoWidth + 'px"';

				var navClasses = '';
				navClasses += (linksPadding && linksPadding != 'unset') ? 'tt-ext-sticky-header-links-p-' + linksPadding : '';
				var headerData = null;

				_.extend(HeaderView.prototype, {
					getContext: _.wrap(HeaderView.prototype.getContext, function (fn) {
						var result = fn.apply(this, _.toArray(arguments).slice(1));

						// For OLD versions of Sticky Header (template and styles on theme)
						result.stickyHeaderEnabled = stickyHeaderEnabled;

						// For NEW versions of Sticky Header (template and styles on Extension)
						result.ttStickyHeader = {
							isEnabled: stickyHeaderEnabled,
							logoUrl: logoUrl,
							logoWidth: logoWidth,
							cartClass: cartClass,
							searchClass: searchClass,
							navClasses: navClasses
						}
						
						headerData = result; // Save Header Data for sticky header

						return result;
					})
				});

				// Create Sticky Header Child View
				var layout = container.getComponent('Layout');
				if(layout)
				{
					layout.addChildView('StickyHeader', function() { 
						return new StickyHeaderView({
							container: container,
							headerData: headerData // Send Header Data to sticky header child view
						});
					});
				}
				

				// Scroll Settings

				var targetElement = 'header#site-header';
				var classNameToAdd = 'header-scroll';
				var togglePoint = Configuration.get('ttbasetheme.scrollTogglePoint');
				var toggleStatus = false;
				
				jQuery(document).ready(function() {
					// toggle class function
					var scrollToggleClass = function() {
						toggleStatus = !toggleStatus;
						jQuery(targetElement).toggleClass(classNameToAdd);
						closeMenus();
					}
					// check for open menu nav, cart, search 
					var closeMenus = function() {
						// nav menu
						if(jQuery('.header-menu-level1 .open').length) {
							jQuery('.header-menu-level1 .open').removeClass('open');
						}
						// cart menu
						if(jQuery('[data-view="Header.MiniCart"].open').length) {
							jQuery('[data-view="Header.MiniCart"].open').removeClass('open');
						}
						// search
						if(jQuery('.header-menu-search-link.active').length) { // search button
							jQuery('.header-menu-search-link.active').removeClass('active');
						}
						if(jQuery('.header-site-search').length) { // open searchbox
							if(jQuery('.header-site-search').prop("style").display === "block"){
								jQuery('.header-site-search').prop("style").display = "";
							}
						}
						if(jQuery('.tt-dropdown-menu').length) { // items results - 2019.2
							if(jQuery('.tt-dropdown-menu').prop("style").display === "block"){
								jQuery('.tt-dropdown-menu').prop("style").display = "none";
							}
						}
						if(jQuery('.tt-menu.tt-open').length) { // items results - 2020.1
							jQuery('.tt-menu.tt-open').removeClass('tt-open');
						}
						// site settings
						if(jQuery('.header-subheader-settings.open').length) {
							jQuery('.header-subheader-settings.open').removeClass('open');
						}
					}
					// toggle scroll function
					var scrollHeaderBehavior = function() {
						// check device screen width
						var tabletMaxWidth = 991;
						if (window.innerWidth > tabletMaxWidth) {
							// check positions for events
							if (jQuery(window).scrollTop() > togglePoint) {
								if (!toggleStatus) {
									scrollToggleClass();
								}
							} else {
								if (toggleStatus) {
									scrollToggleClass();
								}
							}
						}
					};
					// scroll
					jQuery(window).scroll(function () {
						scrollHeaderBehavior();
					});
				});
			}
		}
	};
	
});
