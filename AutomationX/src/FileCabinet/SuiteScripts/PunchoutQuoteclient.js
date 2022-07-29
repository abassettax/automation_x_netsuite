function createOrder()
{

var itemsall = nlapiGetFieldValue('custbody153');
//console.log("1");
location.href="http://automation.netsuitedev.com/app/site/backend/additemtocart.nl?c=422523&buyid=multi&multi="+itemsall;


//var recordid= nlapiGetRecordId(); 
//var record=nlapiLoadRecord('estimate',recordid);
//console.log("start");

//var itemsall = "";
//var lineCount = parseInt(record.getLineItemCount('item'));


/*Add a Partners sublist to the Sales Order. Note you must provide a valid value
 *for the Partner ID. In this case, to obtain Partner IDs you can look in the UI
 *under Lists > Relationships > Partners. Ensure that the Show Internal ID
 *preference is enabled. IDs will appear in the ID column of the Partner list.
*/
//record2.setLineItemValue('partners','partner', 1,311);
//record2.setLineItemValue('partners','partnerrole', 1,1);
//record2.setLineItemValue('partners', 'isprimary',1, 'T' );
//record2.setLineItemValue('partners', 'contribution',1, 100 );
//Finally, submit the record to save it.
//var id = nlapiSubmitRecord(record, true);
/*
for(x =1; x<= lineCount; x++)
{
var item2 = record.getLineItemValue('item','item',x);
var qty= record.getLineItemValue('item','quantity',x);

var thisitem = item2 + "," + qty + ";" ;
itemsall += thisitem ;

}




location.href="http://automation.netsuitedev.com/app/site/backend/additemtocart.nl?c=422523&buyid=multi&multi="+itemsall;
*/
//location.href="https://autox.securedcheckout.com/app/site/backend/additemtocart.nl?c=422523&buyid=multi&multi="+itemsall;

return true;

}