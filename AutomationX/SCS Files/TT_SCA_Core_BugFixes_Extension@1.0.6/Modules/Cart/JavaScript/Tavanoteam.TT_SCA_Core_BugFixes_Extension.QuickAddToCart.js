
define(
	'Tavanoteam.TT_SCA_Core_BugFixes_Extension.QuickAddToCart'
,   [
		'Profile.Model'
	,	'Cart.QuickAddToCart.View'	
	]
,   function (
		ProfileModel
	,	CartQuickAddToCartView
	)
{
	'use strict';

	return  {
		loadModule: function loadModule(container)
		{	
			_.extend(CartQuickAddToCartView.prototype, {
				getContext: _.wrap(CartQuickAddToCartView.prototype.getContext, function (fn) {
					var result = fn.apply(this, _.toArray(arguments).slice(1));
				
					// Login to See price validation added
					result.showQuickAddToCartButton = !ProfileModel.getInstance().hidePrices() ? result.showQuickAddToCartButton : false;
					
					return result;
				})
			});
		}
	};
});
