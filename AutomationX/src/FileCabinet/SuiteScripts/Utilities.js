/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Feb 2014     Office
 *
 */

/**
 * @param {nlobjRequest}
 *            request Request object
 * @param {nlobjResponse}
 *            response Response object
 * @returns {Void} Any output is written via response object
 */

function getBannerImages(request, response) {
	// get all of the home banner image information

	var columns = [ new nlobjSearchColumn('custrecord_image'),
			new nlobjSearchColumn('custrecord_link'),
            new nlobjSearchColumn('custrecord155'),
			new nlobjSearchColumn('custrecord_caption') ];
  var filters= new Array();  
 filters[0] = new nlobjSearchFilter("isinactive",null,"is","F");

	var searchresults = new nlapiSearchRecord('customrecord_home_banner', null,	filters, columns);
  
	var BannerList = [];

	// loop through the results
	for ( var i = 0; searchresults != null && i < searchresults.length; i++) {

		var Banner = {};
		var searchresult = searchresults[i];
		Banner.link = searchresult.getValue('custrecord_link');
        Banner.video = searchresult.getValue('custrecord155');
		Banner.id = searchresult.getId();
		Banner.image = searchresult.getText('custrecord_image');
		Banner.caption = searchresult.getValue('custrecord_caption');
		BannerList.push(Banner);

	}

	returnValuesJSON = JSON.stringify(BannerList);
	nlapiLogExecution('DEBUG', "Return Values", returnValuesJSON);

	response.write(returnValuesJSON);
}

function getBrandImages(request, response) {
	// get all of the banner images for the current category

	var columns = [ new nlobjSearchColumn('custrecord29'),
			new nlobjSearchColumn('custrecord30'), ];

	var category = request.getParameter('category');
	// create a filter so that you only get brands that match the filter
	/*var filters = [];
	filters[filters.length] = new nlobjSearchFilter('custrecord30', null, 'is',
			category);*/

	var searchresults = new nlapiSearchRecord('customrecord_brand_carousel', null, null, columns);
	var BrandList = [];

	// loop through the results
	for ( var i = 0; searchresults != null && i < searchresults.length; i++) {
		var searchresult = searchresults[i];
		if(category == searchresult.getText('custrecord30'))
			{
			var Brand = {};
			Brand.image = searchresult.getText('custrecord29');
			Brand.category = searchresult.getText('custrecord30');
			BrandList.push(Brand);
			
			}
		
	}

	returnValuesJSON = JSON.stringify(BrandList);
	nlapiLogExecution('DEBUG', "Return Values", returnValuesJSON);

	response.write(returnValuesJSON);
}