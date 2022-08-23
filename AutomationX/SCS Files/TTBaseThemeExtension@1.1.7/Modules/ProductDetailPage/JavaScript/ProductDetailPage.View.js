/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
// @module Tavanoteam.TTBaseThemeExtension.ProductListPage
define('Tavanoteam.TTBaseThemeExtension.ProductDetailPage.View'

	, [
		'jQuery'
		, 'Profile.Model'
		, 'Session'
		, 'SC.Configuration'
		, 'Product.Model'
		, 'tavanoteam_ttbasethemeextension_productdetailpage.tpl'
		, 'Backbone'
		, 'underscore'
	]
	, function (

		jQuery
		, ProfileModel
		, Session
		, Configuration
		, ProductModel
		, tavanoteam_ttbasethemeextension_productdetailpage_tpl
		, Backbone
		, _
	) {
		'use strict';
		// @class ProductViews.Price.View @extends Backbone.View
		var ProductViewsPriceView = Backbone.View.extend(
			{
				//@property {Function} template
				template: tavanoteam_ttbasethemeextension_productdetailpage_tpl
				//@method initialize
				//@param {ProductViews.Price.View.Initialize.Options} options
				//@return {Void}
				, initialize: function (options) {

					this.pdp = options.pdp;
					var self = this;
					var pdpInfo = options.pdp;
					var itemInfo = pdpInfo.getItemInfo();

					this.model = new ProductModel();
					this.model.set("item", itemInfo.item);
					this.model.on('change', this.render, this);

					this.pdp.on('afterOptionSelection', function rejectSelectOption() {
						self.render();
					});

					this.pdp.on('afterQuantityChange', function rejectQty() {
						self.render();
					});

				}

				, setOptions: function () {

					var itemInfo = this.pdp.getItemInfo();
					this.model = new ProductModel(itemInfo);

				}


				//@method getUrlLogin Get the login URL contains an origin hash parameter indicating the current URL to came back after login
				//@return {String}
				, getUrlLogin: function () {
					var url = Session.get('touchpoints.login') + '&origin=' + (Configuration.get('currentTouchpoint') || 'home') + '&origin_hash=';
					return url + encodeURIComponent(this.options.origin === 'PDPQUICK' ? this.model.generateURL().replace('/', '') : Backbone.history.fragment);
				}
				// @method getContext
				// @returns {ProductViews.Price.View.Context}
				, getContext: function () {
			
					this.setOptions();

					var price_container_object = this.model.getPrice();
					
					var configPrice = Configuration.get('ttbasetheme.basePrice');

					var is_price_range = !!(price_container_object.min && price_container_object.max);
					var showComparePrice = true;

					// if (!this.options.hideComparePrice) {
					// 	showComparePrice = is_price_range ?
					// 		price_container_object.max.price < price_container_object.compare_price :
					// 		price_container_object.price < price_container_object.compare_price;
					// }

					// Hide the old price if it is equal to the current price.
					var comparePriceFormatted = this.model.get('item').get(configPrice); // price_container_object.compare_price_formatted || ''
					if(price_container_object.price_formatted === comparePriceFormatted) {
						showComparePrice = false;
					}

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
						, comparePriceFormatted: comparePriceFormatted
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
					//@class ProductViews.Price.View
				}
			}
			, {
				//@property {Array<String>} highlightedViews Contains the list of all origins that in case of using the "LOGIN TO SEE PRICES" feature must render a highlighted notification message
				//@static
				highlightedViews: ['PDPQUICK', 'PDPFULL']
			});
		return ProductViewsPriceView;
	});
//@class ProductViews.Price.View.Initialize.Options
//@property {String?} origin Possible values are:
//  PDPCONFIRMATION         For the PDP confirmation message
//  ITEMCELL                For each item being shown in the item list (ex your-domain.com/search)
//  PDPQUICK                For a PDP being shown on a quick view form
//  PDPFULL                 Full PDP view
//  RELATEDITEM             Related Item
//  PRODUCTLISTDETAILSLATER Used to render each item that was saved for later
//  PRODUCTLISTDETAILSFULL  Used to render each item that is shown inside My Account in the details of a particular Product List
//  PRODUCTLISTDETAILSEDIT  Used when rendering the form to edit an item inside a product list
//  ITEMVIEWCELL            For all list where items are rendered
//
//@property {Number?} linePrice Specify this value if you want to use a different price rather than the one of the line
//@property {String?} linePriceFormatted This string valid must be present if you want to use a custom price containing the formatted value of linePrice
//@property {Boolean?} hideComparePrice
//@property {Item.Model|Product.Model} model