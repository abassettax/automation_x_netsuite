function updateclass( type )
{
  if ( type != 'scheduledd' && type == 'skipdped' ) return; //Only runs from schedualer
	var searchresults = nlapiSearchRecord('transaction', 877, null, null ); //  9.3.08



for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	//var iid = searchresult.getId();
	var iidg = searchresult.getValue('internalid', null, 'group');
	var soclass = searchresult.getValue('class', 'salesrep','group');

	nlapiLogExecution('debug', 'iid',iidg);
	nlapiLogExecution('debug', 'class',soclass);


	var record = nlapiLoadRecord('invoice', iidg); //opens record
	var lineCount = parseInt( record.getLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
	{

	record.setLineItemValue('item', 'class',  x,   soclass);

	}



	nlapiSubmitRecord(record, true);  //saves record and opens the next  


		}
}
