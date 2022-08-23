/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module QuantityPricing
define('QuantityPricingUtils.Utils'
,	[
		'underscore'
	,	'QuantityPricing.Utils'
	]
, function (
		_
	, 	QuantityPricingUtils
	)
{
	'use strict';

	return {

		rearrangeQuantitySchedule: function rearrangeQuantitySchedule(item, children_selection) {

			var price_schedule_exists_in_matrix_child = _.find(children_selection, function (child_item) {
				return child_item.get('_priceDetails').priceschedule;
			})
				, price_schedule_exists_in_matrix_parent = item && item.get('_priceDetails') && item.get('_priceDetails').priceschedule && item.get('_priceDetails').priceschedule.length;

			if (price_schedule_exists_in_matrix_parent || price_schedule_exists_in_matrix_child) {
				
				var parent_quantity_schedule = item.get('_priceDetails').priceschedule
					, result_quantity_pricing = [];

				if (children_selection && children_selection.length === 1) {
					result_quantity_pricing = _.first(children_selection).get('_priceDetails').priceschedule;
				}
				else if (children_selection && children_selection.length > 1) {
					var children_quantity_pricing = _.map(children_selection, function (child) {
						return child.get('_priceDetails') && child.get('_priceDetails').priceschedule || [];
					})
						, reference_quantity_pricing = _.first(children_quantity_pricing)
						, all_children_are_equal = _.every(children_quantity_pricing, function (child_quantity_pricing) {
							return QuantityPricingUtils.areQuantityPricingEqual(reference_quantity_pricing, child_quantity_pricing);
						});
					result_quantity_pricing = all_children_are_equal ? QuantityPricingUtils.computeRanges(children_quantity_pricing) : false;
				}
				else {
					result_quantity_pricing = parent_quantity_schedule;
				}

				// TT addition Start : var showQtyPricing to fix issue with quantity pricing MSRP
				var showQtyPricing = false;
				// TT addition End - var showQtyPricing

				if (result_quantity_pricing) {
					showQtyPricing = true;

					// TT addition Start : add to fix issue with quantity pricing MSRP
					if (result_quantity_pricing.length >= 2) {			

						var firstEl = result_quantity_pricing[0];
						if (firstEl.minimumquantity == 0 && firstEl.maximumquantity == 1) {
							if (result_quantity_pricing.length == 2) {
								showQtyPricing = false;
							} else {
								// firstEl.dontShow = true;
								result_quantity_pricing.shift();
							}
						}

					} else if (result_quantity_pricing.length == 1) {
						showQtyPricing = false;
					}
					// TT addition End

					result_quantity_pricing = _.map(result_quantity_pricing, function (price_range) {
						return {
							maximumquantity: price_range.maximumquantity ? price_range.maximumquantity - 1 : price_range.maximumquantity
							, minimumquantity: price_range.minimumquantity
							, price: price_range.price
							, price_formatted: price_range.price_formatted
							, price_range: price_range.price_range
							, is_range: !!price_range.is_range
							, visible: !price_range.dontShow
						};
					});

					_.first(result_quantity_pricing).minimumquantity = _.first(result_quantity_pricing).minimumquantity || 1;

					result_quantity_pricing.is_visible = showQtyPricing;					
				}

				return result_quantity_pricing;

			}

			return false;

		}
	}
});