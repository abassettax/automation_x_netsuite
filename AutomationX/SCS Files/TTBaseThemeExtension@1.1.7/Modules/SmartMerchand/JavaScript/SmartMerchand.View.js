
// @module Tavanoteam.TTBaseThemeExtension.SmartMerchand
define('SmartMerchand.View'
	, [
		'tavanoteam_ttbasethemeextension_smartmerchand.tpl'
		, 'merchandising_zone_cell_template.tpl'
		, 'merchandising_zone_row_template.tpl'
		, 'Utils'
		, 'Backbone'
		, 'jQuery'
		, 'underscore'
		, 'SmartMerchand.Cell.View'
		, 'CustomContentType.Base.View'
		, 'Item.Collection'
		, 'Backbone.CompositeView'
		, 'Backbone.CollectionView'

	]
	, function (
		tavanoteam_ttbasethemeextension_smartmerchand_tpl
		, merchandising_zone_cell_template_tpl
		, merchandising_zone_row_template_tpl
		, Utils
		, Backbone
		, jQuery
		, _
		, SmartMerchandCellView
		, CustomContentTypeBaseView
		, ItemCollection
		, BackboneCompositeView
		, BackboneCollectionView

	) {
		'use strict';

		// @class Merchandising.View Responsible for rendering the list of item requested by a merchandizing
		// rule @extend Backbone.View
		return CustomContentTypeBaseView.extend({

			template: tavanoteam_ttbasethemeextension_smartmerchand_tpl


			// As an example of the 'install' method, we are going to emulate a fetch to a service with the setTimeout
			// Until the promise is resolved, you won't be able to edit the settings of this CCT
			// The same could happen with the 'update' method
			, install: function (settings, context_data) {

				this._install(settings, context_data);

				// call some ajax here
				this.fetchItemsWithSS();


				var promise = jQuery.Deferred();
				return promise.resolve();
			}

			// The list of contexts that you may need to run the CCT
			// These are all the context data you have available by default depending on where you dropped the cct
			, contextDataRequest: ['item']

			// By default when you drop a CCT in the SMT admin, it will run the 'validateContextDataRequest' method to check that you have
			// all the requested contexts and it will fail if some context is missing.
			// We will override the 'validateContextDataRequest' method to return always true
			// since I want to run the CCT even if I don't have an 'item' or the rest of the context data
			, validateContextDataRequest: function validateContextDataRequest() {
				return true;
			}


			, fetchItemsWithSS: function () {


				if (this.isFetched || _.isEmpty(this.settings))
					return

				var itemIds = [];
				var self = this;

				var url = Utils.getAbsoluteUrl(getExtensionAssetsPath('services/SmartMerchand.Service.ss'));
				url = url + '?ssid=' + this.settings.custrecord_tt_saved_search;

				$.get(url)
					.then(function (result) {
						itemIds = result;

						if(itemIds.length > 0) {

							var data = {
								fieldset: "search",
								id: itemIds.toString()

							};

							self.collection.fetch({
								async: false,
								data: data
							}).done(function () {
								// self.isFetched = true;
								// self.render();
								// self.initSlider()
							});

						}

					});

				BackboneCompositeView.add(this);
				this.on('afterCompositeViewRender', _.bind(this.initSlider, self));

				Backbone.View.prototype.initialize.apply(this, arguments);

				// Data used to fetch items
				// Here we add the boolean filters defined on the cms merchand template


			}

			// @method initialize Creates a new instance of the current view
			// @param {MerchandisingRule.Model} options.model
			// @param {Merchandising.ItemCollection} options.items
			, initialize: function (options) {
				this.application = options.container
				this.collection = new ItemCollection();
				var self = this;
				this.isFetched = false;
				this.model = new Backbone.Model({
					title: "",
					description: ""
				});


				this.collection.on('reset sync', function reRender() {
					// console.log("reset");
					// self.loading = false;
					self.render();
				});

			}

			, childViews: {

				'Zone.Items': function () {
					var self = this;

					// Button Action
					var showAddToCart = null;
					var showSeeMore = null;
					var buttonAction = parseInt(self.settings.custrecord_tt_button_action);
					switch (buttonAction) {
						case 1:
							showAddToCart = "T";
							break;
						case 2:
							showSeeMore = "T";
							break;
						case 3:
							showAddToCart = null;
							showSeeMore = null;
							break;
						default:
							showAddToCart = "T";
					}

					var itemsCollectionView = new BackboneCollectionView({
						childView: SmartMerchandCellView
						, viewsPerRow: Infinity
						, cellTemplate: merchandising_zone_cell_template_tpl
						, rowTemplate: merchandising_zone_row_template_tpl
						, collection: self.collection
						, childViewOptions: {
							showPrice: self.settings.custrecord_tt_show_price && self.settings.custrecord_tt_show_price == "T"
							, showReviews: self.settings.custrecord_tt_show_reviews && self.settings.custrecord_tt_show_reviews == "T"
							, showAddToCart: showAddToCart
							, showSeeMore: showSeeMore
							, application: this.application

						}
					});

					return itemsCollectionView;
				}
			}

			// , detectDevice: function () {
			// 	var isMobile = '';

			// 	if (navigator.userAgent.match(/Android/i)
			// 		|| navigator.userAgent.match(/webOS/i)
			// 		|| navigator.userAgent.match(/iPhone/i)
			// 		|| navigator.userAgent.match(/iPad/i)
			// 		|| navigator.userAgent.match(/iPod/i)
			// 		|| navigator.userAgent.match(/BlackBerry/i)
			// 		|| navigator.userAgent.match(/Windows Phone/i)) {

			// 		isMobile = true;
			// 	} else {
			// 		isMobile = false;
			// 	}
			// 	return isMobile;

			// }

			// @method initSlider
			, initSlider: function () {

				var pauseTime = this.settings.custrecord_tt_pause_time || 5000;

				var control_type = parseInt(this.settings.custrecord_tt_controls);
				var show_pager = false;
				var show_arrows = false;
				if(!control_type || control_type === 1 || control_type === 3 || control_type === 4) {
					show_arrows = true;
				}
				if(!control_type || control_type === 1 || control_type === 2) {
					show_pager = true;
				}

				var self = this;
				var element = this.$el.find('[data-type="carousel-items"]');
				
				this.$slider = _.initBxSlider(element, {
					nextText: '<a class="bx-gallery-custom-next-icon"></a>',
					prevText: '<a class="bx-gallery-custom-prev-icon"></a>',
					auto: this.settings.custrecord_tt_auto_slide && this.settings.custrecord_tt_auto_slide == "T",
					infiniteLoop: true,
					forceStart: false,
					pause: parseInt(pauseTime),
					slideWidth: 300,
					minSlides: 1,
					maxSlides: 4,
					pagerType: 'full',
					stopAutoOnClick: true,
					pager: show_pager,
					controls: show_arrows
				});
			}

			, getButtonStyle: function () {
				var buttonStyle = parseInt(this.settings.custrecord_tt_smart_merchand_btn_style);
				switch (buttonStyle) {
					case 2: buttonStyle = 'secondary'; break;
					case 3: buttonStyle = 'tertiary'; break;
					case 4: buttonStyle = 'quaternary'; break;
					case 5: buttonStyle = 'link'; break;
					default: buttonStyle = 'primary';
				}
				return "button-style-" + buttonStyle;
			}

			, getControlType: function () {
				var control_type = parseInt(this.settings.custrecord_tt_controls);
				return control_type === 4 ? "control-bottom-arrows" : "";
			}

			, getControlStyle: function () {
				var controllerColor = parseInt(this.settings.custrecord_tt_controller_colors_smart_m);
				var controllerShadow = this.settings.custrecord_tt_controls_shadow;

				switch (controllerColor) {
					case 2: controllerColor = 'dark'; break;
					case 3: controllerColor = 'light'; break;
					default: controllerColor = 'default';
				}
				
				var classToAdd = "controls-style-" + controllerColor;

				if(controllerShadow === "T") { classToAdd += " " + "controls-style-shadows"; }

				return classToAdd;
			}

			, getItemBorderStyle: function () {
				var borderType = parseInt(this.settings.custrecord_tt_item_border_type);
				switch (borderType) {
					case 2: borderType = 'smartmerch-items-cell-border'; break;
					case 3: borderType = 'smartmerch-items-image-border'; break;
					default: borderType = '';
				}
				return borderType;
			}

			, getMaxItems: function() {
				var classMaxItems = 'tt-smart-merch-max';
				switch (this.collection.length) {
					case 1: classMaxItems += '-one'; break;
					case 2: classMaxItems += '-two'; break;
					case 3: classMaxItems += '-three'; break;
					case 4: classMaxItems += '-four'; break;
					default: classMaxItems = 'tt-smart-merch-default-items';
				}
				return classMaxItems;
			}

			, smartMerchWidthClass: function() {
				return this.settings.custrecord_tt_smartmerch_fullwidth === "T" ? 'tt-smart-merch-full-width' : 'tt-smart-merch-container';
			}

			, smartMerchContainerClass: function() {
				var classes = '';
				classes += this.getMaxItems();
				classes += ' ' + this.getButtonStyle();
				classes += ' ' + this.getControlType();
				classes += ' ' + this.getControlStyle();
				classes += ' ' + this.getItemBorderStyle();
				return classes;
			}

			// @method getContext @returns {Content.LandingPages.View.Context}
			, getContext: function () {

				// @class Content.LandingPages.View.Context
				return {
					// @property {String} zoneTitle
					zoneTitle: this.model.get('title')
					// @property {Boolean} isZoneDescription
					, isZoneDescription: !!this.model.get('description')
					// @property {Stirng} zoneDescription
					, zoneDescription: this.model.get('description')

					, title: this.settings.custrecord_tt_title_smart_merchand

					, smartMerchWidthClass: this.smartMerchWidthClass()

					, smartMerchContainerClasses: this.smartMerchContainerClass()
				};
			}

		});
	});

