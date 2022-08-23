
define(
	'Tavanoteam.TTBaseThemeExtension.LazyLoading'
,   [
		'SC.Configuration'
	,	'jQuery'
	]
,   function (
		Configuration
	,	jQuery
	)
{
	'use strict';

	return {

		loadModule: function loadModule(container) {

			// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.LazyLoading.....');

			var layout = container.getLayout();

			var lazyElements = Configuration.get('ttbasetheme.lazyloadingitems');
			if(lazyElements.length) {
				
				// define styles and create style element
				var lazyInitialStyles = "opacity: 0; position: relative; top: 30px;";
				var lazyShowStyles = "opacity: 1; position: relative; top: 0px;";
				var style = document.createElement('style');
				document.head.appendChild(style);
				
				// configure selector (children or not) and insert styles to style element
				for (var index = 0; index < lazyElements.length; index++) {
					lazyElements[index].lazyloadingselector = lazyElements[index].lazyloadingchildren === "Yes" ? lazyElements[index].lazyloadingselector + ">*" : lazyElements[index].lazyloadingselector;
					style.sheet.insertRule(lazyElements[index].lazyloadingselector + "{" + lazyInitialStyles + "}");
					style.sheet.insertRule(lazyElements[index].lazyloadingselector + ".tt-lazy-show{" + lazyShowStyles + "}");
				}

				// function to unhide elements
				var showElements = function(elementOffset) {
					for (var index = 0; index < lazyElements.length; index++) {
						jQuery(lazyElements[index].lazyloadingselector).not(".tt-lazy-show").each( function(i){
							var bottom_of_element = jQuery(this).offset().top + elementOffset;
							var bottom_of_window = jQuery(window).scrollTop() + jQuery(window).height();
							if( bottom_of_window > bottom_of_element ){
								jQuery(this).addClass("tt-lazy-show");
							}
						});
					}
				};

				// execute effect
				var elementScrollOffset = 200;
				var elementLoadOffset = -100;
				layout.on('afterAppendView', function(){
					jQuery(document).ready(function() {

						// unhide on load
						var startLazyElementsTimer = 0;
						var startLazyElementsFunction = function() {
							startLazyElementsTimer ++;
							if(startLazyElementsTimer > 2) {
								showElements(elementLoadOffset);
							}
							if(startLazyElementsTimer >= 5) {
								clearInterval(startLazyElementsInterval);
							}
						};
						var startLazyElementsInterval = setInterval(startLazyElementsFunction, 1500);

						// unhide on scroll
						jQuery(window).scroll( function(){
							showElements(elementScrollOffset);
						});
					});
				});
			}
		}

	};
});
