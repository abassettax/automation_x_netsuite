function autosendpdf( type )
{
  if ( type != 'sscheduled' && type != 'sskipped' ) return; //Only runs from schedualer
var searchresults = nlapiSearchRecord('transaction', 1111, null, null ); // results from the Pervasive Auto Send PDF Email Report

nlapiLogExecution('debug','searchresults ', searchresults );

for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var iid = searchresult.getId( );
	var record = nlapiLoadRecord('invoice', searchresult.getId( )); //opens record

nlapiLogExecution('debug','iddd ', idd);

//print the transaction to a PDF file object
var file = nlapiPrintRecord('TRANSACTION', record.getId(), 'DEFAULT', null);
file.setName( record.getFieldValue('tranid') +".pdf");


//create email

var author = 937;
var recipient =  "mike.harris@automation-x.com";
var sub = "Automation-x Auto email "+record.getFieldValue('tranid');
nlapiLogExecution('debug','sub ', sub );
var body = "AX PDF";
var cc = 937;


nlapiSendEmail(author, recipient, sub, body, cc, null, null, file);



var newcount = record.getFieldValue('custbody120') + 1 ;



//----------------------------------------------------------------------------------------------------
record.setFieldValue('custbody119', "F"); // sets send value back to False  

record.setFieldValue('custbody120', newcount );
//------------------------------------------------------------------------------------------------------


	
	nlapiSubmitRecord(record, true);  //saves record and opens the next
		}
}