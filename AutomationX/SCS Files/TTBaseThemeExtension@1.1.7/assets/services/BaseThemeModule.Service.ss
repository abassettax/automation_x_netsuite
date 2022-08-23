
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavanoteam.TTBaseThemeExtension.BaseThemeModule.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		//console.log('Tavanoteam.TTBaseThemeExtension.BaseThemeModule.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}