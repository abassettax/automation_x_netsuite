define(
	'Tavanoteam.TTBaseThemeExtension.FixedBackToTop'
,   [
		'SC.Configuration',
		'GlobalViews.BackToTop.View',
        'fixed_back_to_top.tpl',
		'underscore',
		'jQuery'
	]
,   function (
		Configuration,
		GlobalViewsBackToTopView,
		backtotoptemplate,
		_,
		jQuery
	)
{
	'use strict';

	return  {
		loadModule: function loadModule(container)
		{
			// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.FixedbackToTop.....');

			// scroll
			var togglePoint = jQuery( window ).height() + Configuration.get('ttbasetheme.backtotoptogglepoint');
			var toggleStatus = false;
			jQuery(document).ready(function() {
				// toggle class function
				var scrollToggleClass = function() {
					toggleStatus = !toggleStatus;
					jQuery('#fixed-back-to-top-container').toggleClass('show-back-to-top');
				}
				// toggle scroll function
				var scrollHeaderBehavior = function() {
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
				};
				// scroll
				jQuery(window).scroll(function () {
					scrollHeaderBehavior();
				});
			});

			// replace template
			_.extend(GlobalViewsBackToTopView.prototype, {

				initialize: _.wrap(GlobalViewsBackToTopView.prototype.initialize, function (fn) {
					var ret = fn.apply(this, _.toArray(arguments).slice(1));
					
					this.template = backtotoptemplate;
					
					return ret;
				}),

				getContext: _.wrap(GlobalViewsBackToTopView.prototype.getContext, function (fn) {
						
					var result = fn.apply(this, _.toArray(arguments).slice(1));
					
					var sidePosition = Configuration.get('ttbasetheme.backtotopside') === "Right" ? "right" : "left";
					sidePosition = sidePosition + ": " + Configuration.get('ttbasetheme.backtotopside0ffset') + "px;";
					
					result.bottomOffset = "bottom: " + Configuration.get('ttbasetheme.backtotopbottomoffset') + "px;";
					result.sidePosition = sidePosition;
					result.backgroundOpacity = "opacity: " + (Configuration.get('ttbasetheme.backtotopbgopacity') / 100) + ";";
					result.backgroundColor = "background-color: " + Configuration.get('ttbasetheme.backtotopbgcolor') + ";";
					result.arrowColor = "color: " + Configuration.get('ttbasetheme.backtotopcolor') + ";";
					result.borderRadius = "border-radius: " + Configuration.get('ttbasetheme.backtotopborderRadius') + "px;";

					return result;
				})

			});
		}
	};
});
