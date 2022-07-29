/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Sep 2016     jason
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function PaycheckVoucher(Obj) {
//	var filters = new Array();
//	filters[0] = new nlobjSearchFilter( 'trandate', null, 'onOrAfter', 'daysAgo90' );

	// Define return columns
//	var columns = new Array();
//	columns[0] = new nlobjSearchColumn( 'entity' );	
//	var dupRecords = nlapiCreateSearch(paycheck, filters, columns);
//	var resultSet = dupRecords.runSearch();

//	resultSet.forEachResult(function(searchResult)
//		{
//	var InterID=(searchResult.getValue('InternalID')); 
//	var loadCategory = nlapiLoadRecord("inventoryitem", InterID);  
//	var newurl= new Date().getUTCMilliseconds();
//	newurl=InterID+newurl;
//	loadCategory.setFieldValue('urlcomponent',newurl); 
//	loadCategory.setFieldValue('metataghtml',"<meta name=\"robots\" content=\"noindex\">"); 
//	nlapiSubmitRecord(loadCategory , true);		
//		return true;                // return true to keep iterating move to end
//		});		
			var record = nlapiLoadRecord('check', 1233964);
			var amount = record.getFieldValue('amount');
		  	log.debug('amount: ' + amount);
//			var numberOfAddresses = record.getLineItemCount('addressbook');

			
			
			
}
