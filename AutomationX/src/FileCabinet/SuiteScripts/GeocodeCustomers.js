/**
 * Module Description
 * 
 * Version    Date            Author                Remarks
 * 1.00       13 Nov 2013     Jason Smith NXTurn
 *
 */

/**
 * @param {String} This scheduled script processes saved search to set coordinates for address, used in Dealer Locator Service
 * @returns {Void}
 */
function geoCode(type) {

	// create search; alternatively nlapiLoadSearch() can be used to load a saved search
	//var search = nlapiCreateSearch('salesorder', ['mainline', 'is', 'T']);
	
	
	
	var filters = [];
	
	filters[0] = new nlobjSearchFilter('custrecordloc_google_map',null, 'is', 'T');
	filters[1] = new nlobjSearchFilter('custrecord_latitude',null, 'noneof', '@NONE@');
	
 
 var columns = [];
 	columns[columns.length] = new nlobjSearchColumn('name');
 	columns[columns.length] = new nlobjSearchColumn('address1');
 	columns[columns.length] = new nlobjSearchColumn('city');
 	columns[columns.length] = new nlobjSearchColumn('state');
 	columns[columns.length] = new nlobjSearchColumn('zip');
 	columns[columns.length] = new nlobjSearchColumn('country');
 	columns[columns.length] = new nlobjSearchColumn('phone');
 	//had to remove this because it was causing duplicates
 	//columns[columns.length] = new nlobjSearchColumn('category');
 	columns[columns.length] = new nlobjSearchColumn('custrecordloc_google_map');
 	columns[columns.length] = new nlobjSearchColumn('custrecord_latitude');
 	columns[columns.length] = new nlobjSearchColumn('custrecord_longitude');
 	

    
    //var searchResults = nlapiSearchRecord( 'location', null, filters, columns );
    var search = nlapiCreateSearch('location', filters, columns);
    
    //load the search and encapsulate the results so we can process more than 100
	//var search = nlapiLoadSearch('location', 'customsearch_googlemaplocation');
	var searchResults = search.runSearch();
	
	
	
	//var search = nlapiLoadSearch('customer', 'customsearch_nx_dealerlocator_2');
	
	//var searchResults = search.runSearch();

	// resultIndex points to record starting current resultSet in the entire results array 
	var resultIndex = 0; 
	var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
	var resultSet; // temporary variable used to store the result set
	do 
	{
	    // fetch one result set
	    resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

	    // increase pointer
	    resultIndex = resultIndex + resultStep;

	    // process or log the results
	    nlapiLogExecution('DEBUG', 'resultSet returned', resultSet.length 
	      + ' records returned');
	    
	    
	    for ( var i = 0; resultSet != null && i < resultSet.length; i++ ) 
		{
			
	    	
	    		
	    		
	    		
	    		var searchresult = resultSet[i];
	    		
	    		var latitude = searchresult.getValue('custrecord_latitude');
	    		if(latitude == "")
	    			{
	    			
	    			
	    			var addr1 = searchresult.getValue('address1');
					var city = searchresult.getValue('city');
					var state = searchresult.getValue('state');
					var zip = searchresult.getValue('zip');
					var country = searchresult.getValue('country');
					
					
					var fulladdress = addr1 + ",+" + city + ",+" + state + ",+" + zip + ", " + country;
					var replaced = fulladdress.split(' ').join('+');
					
					var url ='http://maps.googleapis.com/maps/api/geocode/json?address=' + replaced + '&sensor=false';
					
					var Data = nlapiRequestURL(url, null, null, null);
					
					/*var Data = nlapiRequestURL(
							'http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false', null, null, null);*/
				
					try{
					
					var json = JSON.parse(Data.body);
				    var lat = json.results[0].geometry.location.lat;
				    var long = json.results[0].geometry.location.lng;
					
					var id = searchresult.getId();
					var record = nlapiLoadRecord('location', id);
					record.setFieldValue('custrecord_latitude', lat);
					record.setFieldValue('custrecord_longitude', long);
					
					nlapiSubmitRecord(record);
		    		
		    		    		
		    		
		    		
		    	}

		    	
		    	catch(err)
		    	{
		    		
		    		  nlapiLogExecution('DEBUG', 'catch error =', err);
		    		
		    	}
	    			
	    			
	    			
	    			
	    			
	    			}
				
				
	    	
	    	
		}
			
			

	    
	    
	// once no records are returned we already got all of them
	} while (resultSet.length > 0) 

	

	
}


function getStoreLocatorCustomers(request, response)
{
	
    
	
	var filters = [];
	
	filters[0] = new nlobjSearchFilter('custrecordloc_google_map',null, 'is', 'T');
	
 
 var columns = [];
 	columns[columns.length] = new nlobjSearchColumn('custrecord31');
 	columns[columns.length] = new nlobjSearchColumn('address1');
 	columns[columns.length] = new nlobjSearchColumn('city');
 	columns[columns.length] = new nlobjSearchColumn('state');
 	columns[columns.length] = new nlobjSearchColumn('zip');
 	columns[columns.length] = new nlobjSearchColumn('country');
 	columns[columns.length] = new nlobjSearchColumn('phone');
 	//had to remove this because it was causing duplicates
 	//columns[columns.length] = new nlobjSearchColumn('category');
 	columns[columns.length] = new nlobjSearchColumn('custrecordloc_google_map');
 	columns[columns.length] = new nlobjSearchColumn('custrecord_latitude');
 	columns[columns.length] = new nlobjSearchColumn('custrecord_longitude');
 	

    
    //var searchResults = nlapiSearchRecord( 'location', null, filters, columns );
    var search = nlapiCreateSearch('location', filters, columns);
    
    //load the search and encapsulate the results so we can process more than 100
	//var search = nlapiLoadSearch('location', 'customsearch_googlemaplocation');
	var searchResults = search.runSearch();
    
	var html = "";

	// resultIndex points to record starting current resultSet in the entire results array 
	var resultIndex = 0; 
	var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
	var resultSet; // temporary variable used to store the result set
	do 
	{
	    // fetch one result set
	    resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

	    // increase pointer
	    resultIndex = resultIndex + resultStep;

	    // process or log the results
	    nlapiLogExecution('DEBUG', 'resultSet returned', resultSet.length 
	      + ' records returned');
	    
	    
	    for ( var i = 0; resultSet != null && i < resultSet.length; i++ ) 
		{
			
	    	
	    		var searchresult = resultSet[i];
	    		var name = searchresult.getValue('custrecord31');
				var addr1 = searchresult.getValue('address1');
				var city = searchresult.getValue('city');
				var state = searchresult.getValue('state');
				var zip = searchresult.getValue('zip');
				var country = searchresult.getValue ('country');
				var phone = searchresult.getValue('phone');
				var lat = searchresult.getValue('custrecord_latitude');
				var long = searchresult.getValue('custrecord_longitude');
				var webaddress = "";
				
				var webaddressline = "";
				var countryfilter = "";
				
				
				if(webaddress != "")
					{
					
					webaddressline = '<span data-type="webaddress" class="webaddress"><a href="'+webaddress+'" target="_blank">'+webaddress+'</a></span><br>';
					
					}
				
				if(country == "US")
				 	{
					countryfilter = '<p class="unitedstates">';
				 	}
				else
					{
					countryfilter = '<p class="international">';
					}
				

				
				html += '<div data-longitude="'+long+'" data-latitude="'+lat+'" class="store box" data-type="store">' +
									
				                         countryfilter + 
										'<span data-type="title" class="title">'+name+'</span><br>' +
										'<span data-type="address">'+addr1+'</span><br>' +
										'<span data-type="city">'+city+'</span>, ' +
										'<span data-type="state">'+state+' </span>' +
										'<span data-type="zipcode">'+zip+'</span><br>' +
                                        '<span data-type="phone">'+phone+' </span><br>' +
										//'<span data-type="country">'+country+'</span><br>' +
										webaddressline +
										//'<span class="tags">Tags: Art</span><br>' +
										'<span class="directions" data-type="directions">' +
											'<label data-type="directions-label">Get directions</label>' +
											'<input type="text" class="hidden" data-type="directions-input">' +
										'</span>' +
									'</p>' +
								'</div>';
	
		
		}
			
			
	    
	    
	// once no records are returned we already got all of them
	} while (resultSet.length > 0) 
		
		response.writeLine('<div class="list">' + html + '</div>');

}

