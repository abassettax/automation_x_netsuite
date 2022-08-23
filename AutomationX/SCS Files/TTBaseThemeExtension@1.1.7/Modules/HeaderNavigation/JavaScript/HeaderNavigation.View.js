// @module Tavanoteam.TTBaseThemeExtension.HeaderNavigation
define('Tavanoteam.TTBaseThemeExtension.HeaderNavigation.View'
	, [
		'underscore'
		, 'Header.View'
		, 'Header.Menu.View'
		, 'SC.Configuration'
		, 'tavanoteam_ttbasethemeextension_headermenu_normal.tpl'
		, 'tavanoteam_ttbasethemeextension_headermenu_thumbnail.tpl'
		, 'tavanoteam_ttbasethemeextension_headermenu_compact.tpl'
	]
	, function (
		_
		, HeaderView
		, HeaderMenuExtension
		, Configuration
		, tavanoteam_ttbasethemeextension_headermenu_normal
		, tavanoteam_ttbasethemeextension_headermenu_thumbnail
		, tavanoteam_ttbasethemeextension_headermenu_compact
	) {
		'use strict';
		//TODO: Evaluate from Configuration to load module

		if (Configuration.get('ttbasetheme.navigation')) {

			// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.HeaderNavigation Module.....');

			var clickToOpen = Configuration.get('ttbasetheme.navigationClickToOpen');

			var categoryCountSecondLevel = parseInt(Configuration.get('ttbasetheme.numberCategoryToShowMain')) || 0;
			var categoryCountThirdLevel = parseInt(Configuration.get('ttbasetheme.numberCategoryToShow')) || 0;

			var secondLevelCategoriesButtonText = Configuration.get('ttbasetheme.btnAllCategory');
			var thirdLevelCategoriesButtonText = Configuration.get('ttbasetheme.btnCategory');

			// Template Selector - Types: Main Theme | Normal | Compact | Thumbnails | Compact with Thumbnails
			var navMenuType = Configuration.get('ttbasetheme.navigationMenuType');
			if(navMenuType != "Main Theme") {
				var useTemplate = "";
				switch (navMenuType) {
					case "Normal": 					useTemplate = tavanoteam_ttbasethemeextension_headermenu_normal; break;
					case "Compact": 				useTemplate = tavanoteam_ttbasethemeextension_headermenu_compact; break;
					case "Compact with Thumbnails":	useTemplate = tavanoteam_ttbasethemeextension_headermenu_compact; break;
					case "Thumbnails": 				useTemplate = tavanoteam_ttbasethemeextension_headermenu_thumbnail; break;
				}
				_.extend(HeaderMenuExtension.prototype, {
					template: useTemplate
				});
			}

			// Close Header Menu Navigation when open Header Cart or Header Search
			if(clickToOpen) {
				_.extend(HeaderView.prototype, {

					events: _.extend(HeaderView.prototype.events, {
						'click [data-view="Header.MiniCart"]': 'closeOpenMenu',
						'click .site-search-content-form': 'closeOpenMenu',
						'click .header-menu-search-link': 'closeOpenMenu'
					})

					, closeOpenMenu: function (e) {
						if(jQuery('.cms-menu.open').length) {
							jQuery('.cms-menu.open').removeClass('open');
						}
					}
				});
			}

			// Header Menu Navigation
			// @class Tavanoteam.TTBaseThemeExtension.HeaderNavigation.View @extends Backbone.View
			_.extend(HeaderMenuExtension.prototype, {

				events: _.extend(HeaderMenuExtension.prototype.events, {
					'mouseenter [data-toggle="categories-menu"]': 'menuOpen',
					'mouseleave [data-toggle="categories-menu"]': 'menuClose',
					'click .cms-menu': 'closeContainer',
					'click [data-toggle="categories-menu"]': 'clickMenu'
				})

				, closeContainer: function (e) {
					if (clickToOpen) {
						if(typeof e.currentTarget.dataset.toggle ===  'undefined'){
							this.menuCloseAll();
						}
					}
				}
				, clickMenu: function (e) {
					if (clickToOpen) {
						jQuery('.header-menu-level1-anchor').removeAttr('href');
						if (jQuery(e.currentTarget).hasClass('open')) {
							this.menuCloseAll();
							jQuery(e.currentTarget).removeClass('open');
						} else {
							this.menuCloseAll();
							jQuery(e.currentTarget).addClass('open');
						}
					} else {
						jQuery(e.currentTarget).removeClass('open');
					}
					this.compactMenuOpenSide(e);
				}
				, menuOpen: function (e) {
					if (!clickToOpen) {
						jQuery(e.currentTarget).addClass('open');
					}
					this.compactMenuOpenSide(e);
				}
				, menuClose: function (e) {
					if (!clickToOpen) {
						jQuery(e.currentTarget).removeClass('open');
					}
				}
				, menuCloseAll: function (e) {
					jQuery('.cms-menu').removeClass('open');
				}
				, compactMenuOpenSide: function (e) {
					if(jQuery(e.currentTarget).find('.tt-ext-compact-header-menu-level-container')) {
						if(!jQuery(e.currentTarget).hasClass('menu-side-left') && !jQuery(e.currentTarget).hasClass('menu-side-right')){
							var linkPosition = jQuery(e.currentTarget).position().left;
							var middlePoint = jQuery(window).width() / 2;
							if(linkPosition > middlePoint) {
								jQuery(e.currentTarget).addClass('menu-side-left');
							} else {
								jQuery(e.currentTarget).addClass('menu-side-right');
							}
						}
					}
				}
				
				, sliceThirdLevelCategories: function (categories, level, level_to_slice, numberOfCategoriesToShow) {

					try {
						var self = this;

						_.each(categories, function (category) {
							// Third Level
							if (level == level_to_slice) { // Level start at position 0
								if (category.categories.length > numberOfCategoriesToShow) {
									category.categories = category.categories.slice(0, numberOfCategoriesToShow);
								}
							} else {
								self.sliceThirdLevelCategories(category.categories, level + 1, level_to_slice, numberOfCategoriesToShow)
							}
						})

					} catch (e) {

						console.log("ERROR on the function sliceThirdLevelCategories");
						console.log(e);
					}
				}
				, sliceSecondLevelCategories: function (categories, level, level_to_slice_main, numberOfCategoriesToShowMain) {
					try {
						var self = this;

						_.each(categories, function (category) {

							// Second Level
							if (level == level_to_slice_main) { // Level start at position 0
								if (category.categories && category.categories.length > numberOfCategoriesToShowMain) {
									category.categories = category.categories.slice(0, numberOfCategoriesToShowMain);
								}
							} else {
								self.sliceSecondLevelCategories(category.categories, level + 1, level_to_slice_main, numberOfCategoriesToShowMain)
							}
						})

					} catch (e) {

						console.log("ERROR on the function sliceSecondLevelCategories");
						console.log(e);
					}
				}

				, categoriesSeeAllButtons: function (categories) {
					// See All Nav Buttons
					for (var index = 0; index < categories.length; index++) {
						// Second Level
						if(categories[index].categories) {
							var sliceCategoriesSecondLevel = categoryCountSecondLevel != 0;
							if (sliceCategoriesSecondLevel && categories[index].categories.length > categoryCountSecondLevel) { 
								categories[index].sliceCategoriesSecondLevel = 'true';
							}

							// Third Level
							for (var secondIndex = 0; secondIndex < categories[index].categories.length; secondIndex++) {
								var sliceCategoriesThirdLevel = categoryCountThirdLevel != 0;
								var thirdLevelCategories = categories[index].categories[secondIndex].categories ? categories[index].categories[secondIndex].categories.length : false;
								if (sliceCategoriesThirdLevel && thirdLevelCategories > categoryCountThirdLevel) {
									categories[index].categories[secondIndex].sliceCategoriesThirdLevel = 'true';
								}
							}
						}
					}
				}

				//// HTML ELEMENTS - START ////
				, createHTMLMenuSection: function (categories) {
					// Banner Position and Class
					var bannerPosition = Configuration.get('ttbasetheme.headernavigation.htmlPosition');
					bannerPosition = !!bannerPosition ? bannerPosition.toLowerCase() : 'right';
					var bannerContentAbove = (bannerPosition === "top" || bannerPosition === "left");
					var bannerContentClass = 'tt-ext-menu-html-pos-' + bannerPosition;
					
					//// Create Banner ////
					var elements = Configuration.get('ttbasetheme.headernavigation.htmlFields');
					var elementsStyles = Configuration.get('ttbasetheme.headernavigation.htmlStyles');

					// Order Elements by Nav Links, groups, and positions
					elements.sort(function(a,b) { return a.category - b.category; });
					elements.sort(function(a,b) { return a.position - b.position; });
					elements.sort(function(a,b) { return a.group - b.group; });
					
					// Create Elements
					for (var i = 0; i < elements.length; i++) {
						// Create HTML Element
						var elementHTML = "";

						// Element Style
						var textStyle = '';
						textStyle += (elements[i].textColor ? 'color:' + elements[i].textColor + '; ': '');
						if(elements[i].textOffset) {
							if(elements[i].tag === 'Title' || elements[i].tag === 'Description' || elements[i].tag === 'Link') {
								textStyle += 'top:' + elements[i].textOffset + 'px; ';
							}
						}
						
						switch(elements[i].tag) {
							case 'Image': 		elementHTML = '<img class="tt-ext-menu-img" src="' + elements[i].content +'" />'; break;
							case 'Title': 		elementHTML = '<p style="' + textStyle + '" class="tt-ext-menu-title">' + elements[i].content + '</p>'; break;
							case 'Description': elementHTML = '<p style="' + textStyle + '" class="tt-ext-menu-desc">' + elements[i].content + '</p>'; break;
							case 'Link': 		elementHTML = '<a style="' + textStyle + '" class="tt-ext-menu-link" href="' + elements[i].hyperlink + '">'+ elements[i].content +'</a>'; break;
						}

						// Element Wrapper
						
						// Element Styles (width & paddings)
						var elementStyles = '';
						elementStyles += (elements[i].width		? 'width:'		+ elements[i].width 	+ '; ': '');
						elementStyles += (elements[i].padding	? 'padding:' 	+ elements[i].padding 	+ ';': '');

						// For element with HyperLink that are not Link Tag elements
						var elementClass = 'tt-ext-menu-el';
						elementClass += (elements[i].additionalClass ? ' ' + elements[i].additionalClass : '');
						if(elements[i].tag === 'Title' || elements[i].tag === 'Description' || elements[i].tag === 'Link') {
							elementClass += (elements[i].textOffset ? ' tt-ext-menu-el-text-offset' : '');
						}
						if(elements[i].tag != 'Link' && elements[i].hyperlink) {
							elementHTML = '<a style="' + elementStyles + '" class="' + elementClass + '" href="' + elements[i].hyperlink + '">'+ elementHTML +'</a>';
						} else {
							elementHTML = '<div style="' + elementStyles + '" class="' + elementClass + '">'+ elementHTML +'</div>';
						}

						// Line Break
						elementHTML += (elements[i].break ? '<div class="tt-ext-menu-break"></div>' : '');

						elements[i].html = elementHTML;
					}

					//// Add Banner Content To Categories ////
					for (var c = 0; c < categories.length; c++) {
						var categoryBanners = '';

						// Create Category Groups
						var categoryGroups = [];
						var lastGroup = null;
						for (var e = 0; e < elements.length; e++) {
							if(!!elements[e].category) {
								if(categories[c].text.toLowerCase() === elements[e].category.toLowerCase()) {
									if (lastGroup != elements[e].group) {
										categoryGroups.push({
											groupId: elements[e].group,
											html: elements[e].html
										});
										lastGroup = elements[e].group;
									} else {
										categoryGroups[categoryGroups.length - 1].html = categoryGroups[categoryGroups.length - 1].html + elements[e].html;
									}
								}
							}
						}

						// Add Groups To Category Banners
						for (var g = 0; g < categoryGroups.length; g++) {
							// Get group styles
							var groupClass = '';
							var groupStyle = '';
							for (var es = 0; es < elementsStyles.length; es++) {
								if(categories[c].text.toLowerCase() === elementsStyles[es].category.toLowerCase()) {
									if(categoryGroups[g].groupId === elementsStyles[es].group) {
										groupClass += (elementsStyles[es].alignment ? ' tt-ext-header-align-' + elementsStyles[es].alignment.toLowerCase() : '');
										groupClass += (elementsStyles[es].additionalClass ? ' ' + elementsStyles[es].additionalClass : '');
										groupStyle += (elementsStyles[es].padding ? 'padding:' + elementsStyles[es].padding + '; ': '');
										groupStyle += (elementsStyles[es].backgroundColor ? 'background-color:' + elementsStyles[es].backgroundColor + '; ': '');
									}
								}
							}
							groupStyle = groupStyle ? 'style="' + groupStyle + '"' : '';
							categoryBanners += '<div ' + groupStyle + ' class="tt-ext-header-group' + groupClass + '">' + categoryGroups[g].html + '</div>';
						}

						// Add Category Banners
						categoryBanners = '<div class="tt-ext-header-menu-html-content">' + categoryBanners + '</div>';
						categories[c].bannerContent = categoryBanners;
						
						// Add Category Banners Class
						categories[c].bannerContentClass = bannerContentClass;
						categories[c].bannerContentAbove = bannerContentAbove;
					}
				}
				//// HTML ELEMENTS - END ////

				//@method getContext @return Tavanoteam.TTBaseThemeExtension.HeaderNavigation.View.Context
				, getContext: function getContext() {
					
					var categories = Configuration.navigationData || [];
					//@class Tavanoteam.TTBaseThemeExtension.HeaderNavigation.View.Context
					
					// MAIN 
					// Use this variable to change the number of level-2 categories to show on the header
					var NUMBER_OF_CAT_TO_SHOW_MAIN = categoryCountSecondLevel != 0 ? categoryCountSecondLevel : 8;
					// Use this variable to change the level to be sliced
					var LEVEL_TO_SLICE_MAIN = 0;

					// Use this variable to change the number of level-3 categories to show on the header
					var NUMBER_OF_CAT_TO_SHOW = categoryCountThirdLevel != 0 ? categoryCountThirdLevel : 4;
					// Use this variable to change the level to be sliced
					var LEVEL_TO_SLICE = 1;

					// See All Categories Buttons
					if(categoryCountSecondLevel != 0 || categoryCountThirdLevel != 0) {
						this.categoriesSeeAllButtons(categories);
					}

					//MAIN

					if(categoryCountSecondLevel != 0) {
						this.sliceSecondLevelCategories(categories, 0, LEVEL_TO_SLICE_MAIN, NUMBER_OF_CAT_TO_SHOW_MAIN);
					}
					if(categoryCountThirdLevel != 0) {
						this.sliceThirdLevelCategories(categories, 0, LEVEL_TO_SLICE, NUMBER_OF_CAT_TO_SHOW);
					}

					// Compact with Thumbnails
					var showCompactThumbnails = Configuration.get('ttbasetheme.navigationMenuType') === "Compact with Thumbnails" ? true : false;

					// Menu Navigation Top Offset Width
					var menuTopOffset = 'style="top: ' + Configuration.get('ttbasetheme.navigationMenuTopOffset') + 'px"';

					// Thumbnail Width for Thumbnail Menu
					var thumbnailWidthThumbnailMenu = Configuration.get('ttbasetheme.navigationThumbnailsWidth');
					var menuNavThumbnailStyle = 'style="width: ' + thumbnailWidthThumbnailMenu + 'px"';

					// Thumbnail Width for Compact Menu
					var thumbnailHeightCompactMenu = Configuration.get('ttbasetheme.navigationMenu.compactThumbnailsHeight');
					var menuNavCompactThumbnailStyle = 'style="height: ' + thumbnailHeightCompactMenu + 'px"';

					// HTML Contents
					if (Configuration.get('ttbasetheme.navigationBanners')) {
						this.createHTMLMenuSection(categories);
					}

					return {
						categories: categories,
						secondLevelCategoriesButtonText: secondLevelCategoriesButtonText,
						thirdLevelCategoriesButtonText: thirdLevelCategoriesButtonText,
						menuNavTopOffset: menuTopOffset,
						menuNavThumbnailStyle: menuNavThumbnailStyle,
						menuNavCompactThumbnailStyle: menuNavCompactThumbnailStyle,
						showCompactThumbnails: showCompactThumbnails
					};
				}
			});
		}

	});
