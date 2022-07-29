function updateFF( type )
{

var searchresults = nlapiSearchRecord('customrecord_echosign_agreement', 1128, null, null ); // results from the Pervasive Auto Send PDF Email Report

nlapiLogExecution('debug','searchresults ', searchresults );


for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var iid = searchresult.getId( );

	var record = nlapiLoadRecord('customrecord_echosign_agreement', searchresult.getId( )); //opens record
nlapiLogExecution('debug','test');  

 	var ffid = record.getFieldValue('custrecord_echosign_parent_record');
	nlapiLogExecution('debug','ffid', ffid  );
	
 	var astat= record.getFieldText('custrecord_echosign_status');

		
	var ff =  nlapiLoadRecord('itemfulfillment', ffid ); //opens FF record

	ff.setFieldValue('custbody123', astat );

	
	nlapiSubmitRecord(ff, true);  //saves record and opens the next

			}}