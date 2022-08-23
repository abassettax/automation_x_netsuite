// @module Tavanoteam.TTBaseThemeExtension.Slider

// An example cct that shows a message with the price, using the context data from the item

// Use: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/service.ss')) 
// to reference services or images available in your extension assets folder


define(
	'Tavanoteam.TTBaseThemeExtension.Slider'
	, [
		'Tavanoteam.TTBaseThemeExtension.Slider.View'
	]
	, function (
		SliderView
	) {
        'use strict';
        return {

            loadModule: function loadModule(container) {

				// console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.Slider.....');
                
                container.getComponent('CMS').registerCustomContentType({
					id: 'cct_tt_slider'
                    , view: SliderView
                    , options: {
                        container: container
                    }
                });
                
            }
        };
    });