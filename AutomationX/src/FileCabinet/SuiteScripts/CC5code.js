function updateCC( type )
{

var searchresults = nlapiSearchRecord('transaction', 1350, null, null ); // results from the Item Count Script saved search

nlapiLogExecution('debug','searchresults ', searchresults );


//-----------------------------------------------------------------

for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var iid = searchresult.getId( );

	var record = nlapiLoadRecord('inventorycount', searchresult.getId( )); //opens record
	nlapiLogExecution('debug','test');  


//----------------------------------------------------------------------------------------

var lineCount = parseInt( record.getLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
	{

	var ccmemo = record.getLineItemValues('item', 'memo', x);

	if(ccmemo == ""  )
	{

	var ccitem = record.getLineItemValues('item', 'item', x);
	
	var fivecode = nlapiLookupField('item', ccitem , 'custitem35' );

	record.setLineItemValue('item', 'memo',  x,  fivecode);

	}

	}

nlapiSubmitRecord(record, true);  //saves record and opens the next


   }


}