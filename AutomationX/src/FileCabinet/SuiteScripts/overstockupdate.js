function updateoverstock( type )
{
// if ( type != 'scheduledd' && type == 'skipdped' ) return; //Only runs from schedualer



// Sets value to overstocked to no  -- Overstock Update Script part 1

var searchresults = nlapiSearchRecord('item', 1207, null, null ); 
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	///var searchresult = searchresults[ i ];	
	//var iidg = searchresult.getValue('internalid');
	//var ttype = searchresult.getValue('itemtype');

	nlapiLogExecution('debug', 'iid to', searchresults[i].getId());
	//nlapiLogExecution('debug', 'type',ttype);

	var record = nlapiLoadRecord(searchresults[i].getRecordType(),
			searchresults[i].getId() ); //opens record

	record.setFieldValue( 'custitemoverstocked', "F");
	nlapiSubmitRecord(record, true);  //saves record and opens the next  
		}





// Sets value to overstocked for selected items  -- Overstock Update Script part 2

var searchresults = nlapiSearchRecord('item', 1206, null, null ); 
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{

	var record = nlapiLoadRecord(searchresults[i].getRecordType(),
			searchresults[i].getId() ); //opens record


	record.setFieldValue( 'custitemoverstocked', "T");
	nlapiSubmitRecord(record, true);  //saves record and opens the next  

		}




}