// @module Tavanoteam.TTBaseThemeExtension.ProductListPage
define('Tavanoteam.TTBaseThemeExtension.ProductListPage.View'
	, [
		'tavanoteam_ttbasethemeextension_productdetailpage.tpl'
		, 'Utils'
		, 'Backbone'
		, 'jQuery'
		, 'underscore'
		, 'Product.Model'
		, 'Profile.Model'
		, 'SC.Configuration'
		, 'Session'
	]
	, function (
		tavanoteam_ttbasethemeextension_productdetailpage_tpl
		, Utils
		, Backbone
		, jQuery
		, _
		, ProductModel
		, ProfileModel
		, Configuration
		, Session
	) {
		'use strict';

		var pos = -1;
		// @class Tavanoteam.TTBaseThemeExtension.ProductListPage.View @extends Backbone.View
		var ProductViewsPriceView = Backbone.View.extend({

			template: tavanoteam_ttbasethemeextension_productdetailpage_tpl

			, initialize: function (options) {

				this.plp = options.plp;
				this.items = this.plp.getItemsInfo();
				if (pos >= (this.items.length - 1)) {
					pos = -1;
				}

				this.plp.on('beforeShowContent', function () {
					pos = -1;
				});
			}

			, events: {
			}

			, bindings: {
			}

			, childViews: {

			}

			//@method getUrlLogin Get the login URL contains an origin hash parameter indicating the current URL to came back after login
			//@return {String}
			, getUrlLogin: function () {
				var url = Session.get('touchpoints.login') + '&origin=' + (Configuration.get('currentTouchpoint') || 'home') + '&origin_hash=';
				return url + encodeURIComponent(this.options.origin === 'PDPQUICK' ? this.model.generateURL().replace('/', '') : Backbone.history.fragment);
			}

			//@method getContext @return Tavanoteam.TTBaseThemeExtension.ProductListPage.View.Context
			, getContext: function getContext() {

				pos += 1;

				this.model = new ProductModel();
				this.model.set("item", this.items[pos]);
				this.model.on('change', this.render, this);

				var price_container_object = this.model.getPrice();

				var configPrice = Configuration.get('ttbasetheme.basePrice');

				var is_price_range = !!(price_container_object.min && price_container_object.max);
				var showComparePrice = true;


				// Hide the old price if it is equal to the current price.
				if(price_container_object.price_formatted === this.model.get('item').get(configPrice)) {
					showComparePrice = false;
				}

				// if (!this.options.hideComparePrice) {
				// 	showComparePrice = is_price_range ?
				// 		price_container_object.max.price < price_container_object.compare_price :
				// 		price_container_object.price < price_container_object.compare_price;
				// }

				//@class ProductViews.Price.View.Context
				return {
					// @property {Boolean} isPriceEnabled
					isPriceEnabled: !ProfileModel.getInstance().hidePrices()
					// @property {String} urlLogin
					, urlLogin: this.getUrlLogin()
					// @property {Boolean} isPriceRange
					, isPriceRange: is_price_range
					// @property {Boolean} showComparePrice
					, showComparePrice: showComparePrice
					// @property {Boolean} isInStock
					, isInStock: this.model.getStockInfo().isInStock
					// @property {Item.Model|Product.Model} model
					, model: this.model
					// @property {String} currencyCode
					, currencyCode: SC.getSessionInfo('currency') ? SC.getSessionInfo('currency').code : ''
					// @property {String} priceFormatted
					, priceFormatted: price_container_object.price_formatted || ''
					// @property {String} comparePriceFormatted
					, comparePriceFormatted: this.model.getItem().get(configPrice) || ''//price_container_object.compare_price_formatted || ''
					// @property {String} minPriceFormatted
					, minPriceFormatted: price_container_object.min ? price_container_object.min.price_formatted : ''
					// @property {String} maxPriceFormatted
					, maxPriceFormatted: price_container_object.max ? price_container_object.max.price_formatted : ''
					// @property {Number} price
					, price: price_container_object.price ? price_container_object.price : 0
					// @property {Number} comparePrice
					, comparePrice: price_container_object.compare_price ? price_container_object.compare_price : 0
					// @property {Number} minPrice
					, minPrice: price_container_object.min ? price_container_object.min.price : 0
					// @property {Number} maxPrice
					, maxPrice: price_container_object.max ? price_container_object.max.price : 0
					// @property {Boolean} showHighlightedMessage
					, showHighlightedMessage: _.indexOf(ProductViewsPriceView.highlightedViews, this.options.origin) >= 0
				};

			}
		});
		return ProductViewsPriceView;
	});