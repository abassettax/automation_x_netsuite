
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavanoteam.TTBaseThemeExtension.SmartMerchand.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		//console.log('Tavanoteam.TTBaseThemeExtension.SmartMerchand.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}