function setequal()
{
var searchresults = nlapiSearchRecord('transaction', '2235', null, null ); 
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
	var searchresult = searchresults[ i ];	
	var soid =searchresult.getId();
	var ffqty =searchresult.getValue('quantityshiprecv');
        var lineid =searchresult.getValue('linesequencenumber');

               var record = nlapiLoadRecord('salesorder',  soid ); //opens record
	
nlapiLogExecution('DEBUG', 'soid ',soid );
nlapiLogExecution('DEBUG', 'lineid',lineid);
nlapiLogExecution('DEBUG', 'ffqty',ffqty);

 record.setLineItemValue('item', 'quantity',lineid,ffqty);  
//record.commitLineItem('item');
nlapiSubmitRecord(record,false,true);

}

}