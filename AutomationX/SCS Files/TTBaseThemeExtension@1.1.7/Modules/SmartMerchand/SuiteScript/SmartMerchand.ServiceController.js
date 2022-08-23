
define(
	'Tavanoteam.TTBaseThemeExtension.SmartMerchand.ServiceController'
	, [
		'ServiceController',
		'SmartMerchand.Model'
	]
	, function (
		ServiceController,
		SmartMerchandModel

	) {
		'use strict';

		return ServiceController.extend({

			name: 'Tavanoteam.TTBaseThemeExtension.SmartMerchand.ServiceController'

			// The values in this object are the validation needed for the current service.
			, options: {
				common: {
				}
			}

			, get: function get() {
				var id = this.request.getParameter('ssid');
				return SmartMerchandModel.getItemsSS(id);
			}

			, post: function post() {
				// not implemented
			}

			, put: function put() {
				// not implemented
			}

			, delete: function () {
				// not implemented
			}
		});
	}
);