
define(
	'Tavano.DoNotShowPricing.DoNotShowPricing'
,   [
		"Cart.AddToCart.Button.View"
	]
,   function (
		CartAddToCartButtonView
	)
{
	'use strict';

	_.extend(CartAddToCartButtonView.prototype, {
		events: _.extend(CartAddToCartButtonView.prototype.events, {
			'mouseup [data-type="add-to-cart"]': 'disableMouseupEvent'
		}),
		disableMouseupEvent: function(e){}
	});

	return  {
		mountToApp: function mountToApp (container)
		{
			var layout = container.getComponent('Layout');
			var pdp = container.getComponent("PDP");
			var plp = container.getComponent("PLP");
			var cart = container.getComponent("Cart");

			layout.addToViewContextDefinition('ProductViews.Price.View', 'dontShowPrice', 'boolean', function(context) {
				if(pdp && pdp.getItemInfo()){
					var pdpItemInfo = pdp.getItemInfo();
					if(pdpItemInfo && context.model.internalid && context.model.internalid !== pdpItemInfo.item.internalid){
						return context.model && context.model.dontshowprice ? 
							context.model.dontshowprice : false;
					}
					return context.model && context.model.item && context.model.item.dontshowprice ? 
							context.model.item.dontshowprice : false;
				}

				if(plp && plp.getItemsInfo()){
					return context.model && context.model.item && context.model.item.dontshowprice ? 
						context.model.item.dontshowprice : false;
				}

				return context.model && context.model.dontshowprice ? context.model.dontshowprice : false;
			});
					
			layout.addToViewContextDefinition('ProductViews.Price.View', 'dontShowPriceMessage', 'string', function(context) {
				if(pdp && pdp.getItemInfo()){
					var pdpItemInfo = pdp.getItemInfo();
					if(pdpItemInfo && context.model.internalid && context.model.internalid !== pdpItemInfo.item.internalid){
						return context.model && context.model.dontshowprice ? 
							context.model.nopricemessage || context.model.nopricemessage2  : "";
					}
					return context.model && context.model.item && context.model.item.dontshowprice ? 
						context.model.item.nopricemessage || context.model.item.nopricemessage2  : "";
				}

				if(plp && plp.getItemsInfo()){
					return context.model && context.model.item && context.model.item.dontshowprice ? 
						context.model.item.nopricemessage || context.model.item.nopricemessage2  : "";
				}

				return context.model && context.model.dontshowprice ? 
					context.model.nopricemessage || context.model.nopricemessage2  : "";
				
			});

			layout.addToViewContextDefinition('Transaction.Line.Views.Price.View', 'dontShowPrice', 'boolean', function(context) {
				if(plp){
					var model = _.find(plp.getItemsInfo(), function (item){
						return item.internalid == context.model.item.internalid
					});
					if(model){
						return model.dontshowprice;
					}
				}
				return context.model.item.dontshowprice;
			});

			layout.addToViewContextDefinition('ProductLine.Sku.View', 'custitem35', 'string', function(context) {
				if(context.model.item.custitem35){
					
				}else{
					context.model.item.custitem35 = "-"+context.model.item.internalid;
				}
				return context.model.item.custitem35 ? context.model.item.custitem35 : "-"+context.itemId;
			});

			layout.addToViewContextDefinition('Transaction.Line.Views.Cell.Navigable.View', 'itemImage', 'string', function(context) {
				return context.model.item.itemimages_detail ? "" : "/Item Images/-"+context.itemId+"_main-1.jpg";
			});
			
		}
	};
});
