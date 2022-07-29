function updatePOnoLocation()
{
  
  var columns = new Array();
   columns[0] = new nlobjSearchColumn("internalid",null,"GROUP");
   columns[1] = new nlobjSearchColumn("trandate",null,"GROUP").setSort(false);

var purchaseorderSearch = nlapiSearchRecord("purchaseorder",null,
[
   ["mainline","is","F"], 
   "AND", 
   ["type","anyof","PurchOrd"], 
   "AND", 
   ["location","anyof","@NONE@"], 
   "AND", 
   ["quantity","greaterthan","0"], 
   "AND", 
   ["trandate","onorafter","threefiscalyearsagotodate"]
], 

columns

);
  
 if(purchaseorderSearch){
   
   for ( var y = 0; purchaseorderSearch != null && y < purchaseorderSearch.length;y++ )
 		{
  var recid =  purchaseorderSearch[y].getValue(columns[0]);
   
    nlapiLogExecution('DEBUG', 'recid', recid  );
   var rec = nlapiLoadRecord('purchaseorder',recid);
var loc = rec.getFieldValue('location');
   nlapiLogExecution('DEBUG', 'loc', loc  );

var lineCount = rec.getLineItemCount('item');
   nlapiLogExecution('DEBUG', 'lineCount', lineCount  );
for (var i =lineCount;  i >= 1; i--) 
	{
      
   rec.selectLineItem('item',i);
    rec.setCurrentLineItemValue('item','location',loc ,true  ); 
           rec.commitLineItem('item');      
    }
nlapiSubmitRecord(rec,true);
   
        }
               }
  


}