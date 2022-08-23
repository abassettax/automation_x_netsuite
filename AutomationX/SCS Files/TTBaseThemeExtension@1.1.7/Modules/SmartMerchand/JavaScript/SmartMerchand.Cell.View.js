define(
    'SmartMerchand.Cell.View'
    , [
        'ProductViews.Price.View'
        , 'GlobalViews.StarRating.View'
        , 'Cart.AddToCart.Button.View'
        , 'Backbone.CompositeView'

        , 'cms_merchandizing_cell.tpl'

        , 'Backbone'
        , 'Product.Model'
    ]
    , function (
        ProductViewsPriceView
        , GlobalViewsStarRatingView
        , CartAddToCartButtonView
        , BackboneCompositeView

        , cms_merchandizing_cel_tpl

        , Backbone
        , ProductModel
    ) {
        'use strict';

        // @class ItemViews.RelatedItem.View Responsible for rendering an item details. The idea is that the item rendered is related to another one in the same page
        // @extend Backbone.View
        return Backbone.View.extend({

            //@property {Function} template
            template: cms_merchandizing_cel_tpl

            //@method initialize Override default method to make this view composite
            //@param {ItemViews.RelatedItem.View.Initialize.Options} options
            //@return {Void}
            , initialize: function (options) {

                this.showPrice = options.showPrice;
                this.showRating = options.showReviews;
                this.showAddToCart = options.showAddToCart;
                this.showSeeMore = options.showSeeMore;
                this.application = options.application;
                Backbone.View.prototype.initialize.apply(this, arguments);
                BackboneCompositeView.add(this);
            }

            , childViews: {
                'Item.Price': function () {
                    return new ProductViewsPriceView({
                        model: this.model,
                        origin: 'RELATEDITEM'
                    });
                }
                , 'Global.StarRating': function () {
                    return new GlobalViewsStarRatingView({
                        model: this.model,
                        showRatingCount: false
                    });
                }
                , 'AddToCart': function () {
                    var model = this.options.model;
                    var product = new ProductModel({
                        item: model
                    });
                    if (product.get("item").get("matrixchilditems_detail") && product.get("item").get("matrixchilditems_detail").length > 0) {
                        return;
                    } else {
                        return new CartAddToCartButtonView({
                            model: product,
                            application: this.application,
                        });

                    }
                }

            }

            //@method getContext
            //@returns {ItemViews.RelatedItem.View.Context}
            , getContext: function () {

                //@class ItemViews.RelatedItem.View.Context
                return {
                    //@property {String} itemURL
                    itemURL: this.model.getFullLink()
                    //@property {String} itemName
                    , itemName: this.model.get('_name') || this.model.Name
                    // @property {ImageContainer} thumbnail
                    , thumbnail: this.model.getThumbnail()
                    //@property {String} sku
                    , sku: this.model.get('_sku')
                    // @property {String} itemId
                    , itemId: this.model.get('_id')
                    // @property {Item.Model} model
                    , model: this.model

                    //@property {Boolean} showRating
                    , showRating: this.showRating
                    //@property {Boolean} showRating
                    , showPrice: this.showPrice

                    , showAddToCart: this.showAddToCart

                    , showSeeMore: this.showSeeMore

                    //@property {String} track_productlist_list
                    , track_productlist_list: this.model.get('track_productlist_list')
                    //@property {String} track_productlist_position
                    , track_productlist_position: this.model.get('track_productlist_position')
                    //@property {String} track_productlist_category
                    , track_productlist_category: this.model.get('track_productlist_category')
                };
                //@class ItemViews.RelatedItem.View
            }
        });
    });

//@class ItemViews.RelatedItem.View.Initialize.Options
//@property {Item.Model} model