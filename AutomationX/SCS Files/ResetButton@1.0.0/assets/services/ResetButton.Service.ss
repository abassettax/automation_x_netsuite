
function service(request, response)
{
	'use strict';
	try 
	{
		require('Tavano.ResetButton.ResetButton.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Tavano.ResetButton.ResetButton.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}