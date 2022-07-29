function shipcost( type ) 
{

var searchresults = nlapiSearchRecord('transaction', 1118, null, null ); // FF UPDATE -- Farm Mass INV Update: 

nlapiLogExecution('debug','searchresults ', searchresults );

for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var iid = searchresult.getId( );
	var record = nlapiLoadRecord('itemfulfillment', searchresult.getId( )); //opens record


//print the transaction to a PDF file object
//var file = nlapiPrintRecord('TRANSACTION', record.getId(), 'DEFAULT', null);
//file.setName( record.getFieldValue('tranid') +".pdf");



//----------------------------------------------------------------------------------------------------

var newcost = record.getFieldValue('custbody121');
record.setFieldValue('shippingcost', newcost); //  

record.setFieldValue('custbody121',null );
//------------------------------------------------------------------------------------------------------


	
	nlapiSubmitRecord(record, true);  //saves record and opens the next
		}
}