function updateclass( type )
{
  
	var searchresults = nlapiSearchRecord('transaction', 872, null, null ); //  9.3.08



for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var iid = searchresult.getValue('internalid', 'fulfillingTransaction');
	var cusrec  = searchresult.getValue('internalid', 'customer');
	var soclass = searchresult.getValue('class', 'salesrep');
	nlapiLogExecution('debug', 'iid',cusrec);
	nlapiLogExecution('debug', 'class',soclass);


//----------------------------------------------------------------------------------------------------


var hold1 = "OFF";
var cusrecord = nlapiLoadRecord('customer', cusrec ); //opens record
var holdtype = cusrecord.getFieldValue('creditholdoverride');
var holdtype1 = holdtype;
	nlapiLogExecution('debug', 'holdtype',holdtype );

cusrecord.setFieldValue('creditholdoverride', hold1 );
nlapiSubmitRecord(cusrecord, true);  //saves record and opens the next
                                                      
 

//----------------------------------------------------------------------------------------------------



	var record = nlapiLoadRecord('itemfulfillment', iid); //opens record


	var record = nlapiLoadRecord('itemfulfillment', iid); //opens record
	var lineCount = parseInt( record.getLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
	{

	record.setLineItemValue('item', 'class',  x,   soclass);

	}



	nlapiSubmitRecord(record, true);  //saves record and opens the next

//------------------------------------------------------------------------------------------------------

//var hold1 = "AUTO"
var cusrecord = nlapiLoadRecord('customer', cusrec ); //opens record
cusrecord.setFieldValue('creditholdoverride', holdtype1 )
nlapiSubmitRecord(cusrecord , true);  //saves record and opens the next
                                                      
//------------------------------------------------------------------------------------------------------



		}
}
