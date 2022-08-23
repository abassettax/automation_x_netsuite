define('Tavanoteam.TT_SCA_Core_BugFixes_Extension.QuantityPricing.View'
,	[
		'QuantityPricing.View'
	,	'QuantityPricingUtils.Utils'
	,	'SC.Configuration'
	,	'Profile.Model'
	,	'Utils'
	,	'Backbone'
	,	'underscore'
	]
,	function (
		QuantityPricingView
	,	QuantityPricingUtilsUtils
	,	Configuration
	,	ProfileModel
	,	Utils
	,	Backbone
	,	_
	)
{
	'use strict';

	// console.log('Loading modules - Tavanoteam.TT_SCA_Core_BugFixes_Extension.QuantityPricing Module .....');

	// @class QuantityPricing.View @extend Backbone.View
	_.extend(QuantityPricingView.prototype, {

		// @method initialize
		// @param {QuantityPricing.Initialize.Options} options
		// @return {Void}
		initialize: function () {
			
			this.profileModel = ProfileModel.getInstance();
				
			this._isEnabled = !(Configuration.getRegistrationType() !== 'disabled' && SC.getSessionInfo('loginToSeePrices') && this.profileModel.get('isLoggedIn') !== 'T');
			
			this.price_schedule = QuantityPricingUtilsUtils.rearrangeQuantitySchedule(this.model.get('item'), _.isFunction(this.model.getSelectedMatrixChilds) ? this.model.getSelectedMatrixChilds() : []);

			this.model.on('change', function ()
			{
				var new_price_schedule =  QuantityPricingUtilsUtils.rearrangeQuantitySchedule(this.model.get('item'), _.isFunction(this.model.getSelectedMatrixChilds) ? this.model.getSelectedMatrixChilds() : []);

				if (!_.isEqual(this.price_schedule, new_price_schedule))
				{
					this.price_schedule = new_price_schedule;
					this.render();
				}
			}, this);

			this.item_key = this.model.get('item').id + '' + (new Date()).getMilliseconds();
		}

		// @method getContext
    	// @return {QuantityPricing.View.Context}
		, getContext: function () {
			
			// Addition : showTable var to determine if QtyPricing table is visible based on pricing MSRP
			var showTable = this.price_schedule.is_visible;
			
			// @class QuantityPricing.View.Context
			return {
				// @property {Boolean} isAccordion
				isAccordion: !this.options.notUseAccordion
				// @property {Boolean} showContent ++ Addition showTable
			,	showContent: this._isEnabled && !!this.price_schedule.length && showTable
				//@property {Boolean} priceSchedule
			,	priceSchedule: this.price_schedule
				//@property {Boolean} isOpen
			,	isOpen: this._isOpen
				//@property {Boolean} isModal
			,	isModal: this.options.isModal
				//@property {String} itemKey
			,	itemKey: this.item_key
				// @property {String} title
			,	title: this.options.title || Utils.translate('Quantity discounts available')
			};
			//@class QuantityPricing.View
		}
	});
});

// @class QuantityPricing.Initialize.Options
// @property {Product.Model | Transaction.Line.Model} model
// @property {Boolean} notUseAccordion