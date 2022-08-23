define(
	'Tavanoteam.TTFixedBackToTop.BackToTop'
,   [
		'SC.Configuration',
		'GlobalViews.BackToTop.View',
        'back_to_top.tpl',
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
		mountToApp: function mountToApp (container)
		{
			if(Configuration.get('ttfixedbacktotop.allowExtension')) {

				console.log('Loading Extension - Tavanoteam.TTFixedBackToTop.....');

				// scroll
				var togglePoint = jQuery( window ).height() + Configuration.get('ttfixedbacktotop.togglepoint');
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
						
						var sidePosition = Configuration.get('ttfixedbacktotop.side') === "Right" ? "right" : "left";
						sidePosition = sidePosition + ": " + Configuration.get('ttfixedbacktotop.side0ffset') + "px;";
						
						result.bottomOffset = "bottom: " + Configuration.get('ttfixedbacktotop.bottomoffset') + "px;";
						result.sidePosition = sidePosition;
						result.backgroundOpacity = "opacity: " + (Configuration.get('ttfixedbacktotop.bgopacity') / 100) + ";";
						result.backgroundColor = "background-color: " + Configuration.get('ttfixedbacktotop.bgcolor') + ";";
						result.arrowColor = "color: " + Configuration.get('ttfixedbacktotop.color') + ";";
						result.borderRadius = "border-radius: " + Configuration.get('ttfixedbacktotop.borderRadius') + "px;";

						return result;
					})

				});

			}
		}
	};
});
