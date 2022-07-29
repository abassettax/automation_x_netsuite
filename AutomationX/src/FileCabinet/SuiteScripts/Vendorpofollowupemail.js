function vendorpoemailfollow( type )
{
  if ( type == 'scheduled'  ) return; //Only runs from scheduler
var searchresults = nlapiSearchRecord('vendor', 793, null, null ); // results from the FF End of Month Transfer 9.3.08
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var iid = searchresult.getValue('internalid', 'fulfillingTransaction');
	var record = nlapiLoadRecord('vendor', searchresult.getValue('internalid')); //opens record


//----------------------------------------------------------------------------------------------------
var poemail = record.getFieldValue('email');
  
if(record.getFieldValue( 'custentity196' ) == "" || record.getFieldValue( 'custentity196' ) == null)
{
record.setFieldValue('custentity196', poemail); 
}
  
if(record.getFieldValue( 'custentity197' ) == "" || record.getFieldValue( 'custentity197' ) == null)
{
record.setFieldValue('custentity197', poemail); 
}

if(record.getFieldValue( 'custentity198' ) == "" || record.getFieldValue( 'custentity198' ) == null)
{
record.setFieldValue('custentity198', poemail); 
}
//------------------------------------------------------------------------------------------------------

	nlapiSubmitRecord(record, true);  //saves record and opens the next

		}
}
