
define(
	'Tavanoteam.TT_SCA_Core_BugFixes_Extension.FooterContentCheckout'
,   [
        'Footer.View',
		'Newsletter.Checkout.Model',
		'Newsletter.Checkout.View'
	]
,   function (
		FooterView,
		NewsletterModel,
		NewsletterView
	)
{
	'use strict';

    return {
        loadModule: function loadModule(container) {

			// console.log('Loading modules - Tavanoteam.SCA_Core_BugFixes.FooterContentCheckout.....');

            FooterView.addChildViews &&
            FooterView.addChildViews({
                FooterContent: function wrapperFunction() {
                    return function() {
                        return new NewsletterView({
                            model: new NewsletterModel(),
                            application: container
                        });
                    };
                }
            });

        }
    };
});
