function resetcyclecount(rec_type, rec_id) 
{

/// set count class to c


 var item = nlapiLoadRecord(rec_type, rec_id);
 var locationCount = item.getLineItemCount('locations');

    for (i = 1; i <= locationCount; i = i + 1) 
{ 
var locclass =  item.getLineItemText('locations', 'invtclassification', i);

var qtylocoh = item.getLineItemValue('locations', 'quantityonhand', i);
  nlapiLogExecution('DEBUG', 'customer record created successfully', qtylocoh + 'ID = ' + locclass);
  var invCountClass = item.getLineItemText('locations', 'invtclassification', i);

if( ( invCountClass == "A"  || invCountClass == "B" || invCountClass == "C"  ) && (qtylocoh <= 0 || !qtylocoh))
{
item.setLineItemValue('locations', 'invtclassification', i, '');
    
}

}
//// end set class to c 



// set stock level to 0


nlapiSubmitRecord(item, false, true);



}