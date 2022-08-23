
define(
	'Tavanoteam.TTBaseThemeExtension.AnchorScroll'
,   [
		'underscore'
    ,	'jQuery'
		
	]
,   function (
		_
    ,	jQuery
	)
{
	'use strict';

	return  {
        loadModule: function loadModule (container)
        {
            // console.log('Loading modules - Tavanoteam.TTBaseThemeExtension.AnchorScroll.....');

            // on load anchor 
            jQuery(function() {
                var anchor_parameter = window.location.hash;
                
                if(anchor_parameter !== "" && (anchor_parameter.indexOf("?") < 0) && (anchor_parameter.indexOf("/") < 0) && (anchor_parameter.indexOf("=") < 0)) {
                
                    var findIndex = 0;
                    var findAnchorPoint = function() {
                        findIndex ++;
                        if(jQuery(anchor_parameter).length) {
                            findIndex = 5;
                            jQuery('html, body').animate({scrollTop: jQuery(anchor_parameter).offset().top - 200}, 500);
                        }
                        if(findIndex >= 5) {
                            clearInterval(searchScrollPoint);
                        }
                    };
                    var searchScrollPoint = setInterval(findAnchorPoint, 1000);
                }
            });
            
            
            var layout = container.getLayout();

            // Touchpoints navigation
            _.extend(layout, {

                hrefApplicationPrefixes: ['mailto', 'tel'],
                
                isLinkWithApplicationPrefix: function(href) {
                    return ~_.indexOf(this.hrefApplicationPrefixes, href.split(':')[0]);
                },
                isKeepHref: function($element) {
                    return $element.attr('data-keep-href') === 'true';
                },

                executeClick: _.wrap(layout.executeClick, function(fn, e) {
                    var anchor = jQuery(e.currentTarget),
					href = this.getUrl(anchor) || '#';
                    
                    if(jQuery(e.currentTarget.hash).length)  {
                        if(this.isKeepHref(anchor)) {
                            // Smooth Scrolling
                            jQuery('html, body').animate({scrollTop: jQuery(e.currentTarget.hash).offset().top - 200}, 500);
                            return;
                        }

                        if(this.isLinkWithApplicationPrefix(href)) {
                            e.preventDefault();
                            window.location.href = href;
                        } else {
                            fn.apply(this, Array.prototype.slice.call(arguments, 1));
                        }
                    } else {
                        fn.apply(this, Array.prototype.slice.call(arguments, 1));
                    }
                })
            });
        }
    };
});
