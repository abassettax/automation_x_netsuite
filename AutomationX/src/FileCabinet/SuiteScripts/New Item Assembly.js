function newitemassembly()
{
 // var quoteid = nlapiGetFieldValue('custitem60');
//
///////////////////////////////////////////////////////
 /////////////////////start in use sold
 var lineCounts =  nlapiGetLineItemCount('member');
      // alert(rec.getLineItemValue("member", "item", 1));
for(x =1; x<=lineCounts; x++)
{
////////////////////////////////////////////////on save quick item add
  
if( (nlapiGetLineItemText("member", "item", x).indexOf("-I.U.")!==-1  && nlapiGetLineItemText("member", "item",x ).indexOf("-I.U-S")==-1 ) || (nlapiGetLineItemText("member", "item", x).indexOf("IN USE")!==-1  &&  nlapiGetLineItemText("member", "item",x ).indexOf("IN USE - SOLD")==-1 ))
{
  var newitemid = nlapiGetLineItemValue("member", "item", x);
  //var salesd = nlapiGetLineItemValue("member", "description", x); 
  //var NICF = nlapiGetLineItemText("createdfrom");
  nlapiSubmitField('inventoryitem', newitemid, ['custitem66', 'displayname' ], ["F" ,"IN USE - SOLD"  ]);  //"IN USE"
}
//////////////////////////////////////////////// end on save quick item add
     
}  
///////////////////end in use sold
//////////////////////////////////////////////////////////////////////////
     }  