function massupdatelandedcost(recordType, recordID)
{ 

  ////////////////////////////////////////////////////////landed cost %/////////////////////
   var landedCostPercent = .025;
  ////////////////////////////////////////////////////////////////////////////////
  
 var rec = nlapiLoadRecord(recordType, recordID);
 var cf =  rec.getFieldText('createdfrom');
  //nlapiLogExecution('DEBUG', 'cf', cf); 
  var lc = rec.getFieldValue('landedcostsource1');
   nlapiLogExecution('DEBUG', 'lc', lc); 
   nlapiLogExecution('DEBUG', 'recordType', recordType);
  if(cf.indexOf("Purchase") > -1 && rec.getFieldValue('landedcostsource1') == 'MANUAL' )
    {
       nlapiLogExecution('DEBUG', '1', 1); 

    var amountlandedcost = 0; 
    var amountoldlandedcost = 0;
var lineCount = parseInt(rec.getLineItemCount('item'));
	for(x =1; x<=lineCount; x++)
      {
var qty =rec.getLineItemValue('item', 'quantity', x);
        if(qty){
var itemrate = rec.getLineItemValue('item', 'rate', x);
var itemtypes = rec.getLineItemValue('item', 'itemtype', x);
var currentlandedamount = rec.getFieldValue('landedcostamount1'); 
 nlapiLogExecution('DEBUG', '2', 2); 
         nlapiLogExecution('DEBUG', 'itemtypes', itemtypes); 
if(itemrate>0 && itemtypes == 'InvtPart'){ amountlandedcost =parseInt(amountlandedcost) + ((  itemrate * parseInt(qty)) *  landedCostPercent );   amountoldlandedcost  =parseInt(amountlandedcost) + ((  itemrate * parseInt(qty)) *  .02 ); }
        }
       }
       nlapiLogExecution('DEBUG', 'rec.getFieldValue(landedcostsourcetran1)', rec.getFieldValue('landedcostsourcetran1')); 
  if( rec.getFieldValue('landedcostsourcetran1') == null)
     {
  rec.setFieldValue('custbody187', parseInt(landedCostPercent *100));
       nlapiLogExecution('DEBUG', 'landedCostPercent *100', landedCostPercent *100); 
  rec.setFieldValue('landedcostmethod','VALUE' );  
  rec.setFieldValue('landedcostamount1',amountlandedcost); 
       nlapiLogExecution('DEBUG', 'amountlandedcost2', amountlandedcost); 
     }
     
       }
  rec.setFieldValue('custbody187', 1.1);
  nlapiSubmitRecord(rec); 
       nlapiLogExecution('DEBUG', 'done', recordID); 
}