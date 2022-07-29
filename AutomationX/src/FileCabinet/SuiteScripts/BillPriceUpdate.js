function updatereceiptPOpricing()
{
 if(nlapiGetLineItemCount('purchaseorders')>1){ alert("This Bill has multiple POs.  Please update pricing manually.");  return false; }
var lineCountVB = nlapiGetLineItemCount('item');

  for(q=1;q <= lineCountVB; q++)
	    {
   var dups = 0;
  var lineone =  nlapiGetLineItemValue('item','item',q);
 for(c =1; c <= lineCountVB; c++)
	    { 
          var compareline = nlapiGetLineItemValue('item','item',c)
       
   if(lineone == compareline){dups = dups+1;}
        }
  if(dups > 1){alert('Vendor Bill contains duplicate items please update manually.' + dups); return false;}
        }
  
var POnum = nlapiGetLineItemValue('purchaseorders','id',1);
var rec = nlapiLoadRecord('purchaseorder',POnum);
//alert(POnum);


 for(i =1; i <= lineCountVB; i++)
	    {
  var itemVBrate = nlapiGetLineItemValue('item','rate',i);
  var ItemidVB = nlapiGetLineItemValue('item','item',i);

var lineCountPO = rec.getLineItemCount('item');
for(s =1; ItemidVB && s <= lineCountPO; s++)
	{ 
      var itemPO = rec.getLineItemValue('item','item',s);
      if(itemPO == ItemidVB && itemPO &&  ItemidVB) {  rec.setLineItemValue('item','rate', s, itemVBrate); break;}
    }


        }

  ///////////////////////////////start IRs
  
   var itemreceiptSearch = nlapiSearchRecord("itemreceipt",null,
[
   ["type","anyof","ItemRcpt"], 
   "AND", 
   ["mainline","is","T"], 
   "AND", 
   ["createdfrom.internalidnumber","equalto", POnum]
], 
[
   new nlobjSearchColumn("internalid",null,null)
]
);

var searchleng = itemreceiptSearch.length;
if(!searchleng){alert("No Item Receipts found."); return false;}
 
  for(r =0; itemreceiptSearch && r < searchleng; r++)
	             {
 
var itemreceiptSearchR= itemreceiptSearch[r];
var IRID = itemreceiptSearchR.getValue("internalid",null,null); //alert(IRID);
var IRIDDocNum = itemreceiptSearchR.getValue("tranid",null,null);
var IRClosedPeriod =itemreceiptSearchR.getValue("closed","accountingPeriod",null);
         if(IRClosedPeriod == 'Yes' )
                     {alert("Item Receipt " + IRIDDocNum +  " is in a closed period.  Please check manually");}
                else{ 
var irrec = nlapiLoadRecord('itemreceipt',IRID);
var lineCountIR = irrec.getLineItemCount('item'); 
  //  alert("lineCountIR "+ lineCountIR);


 for(kd =1; kd <= nlapiGetLineItemCount('item');  kd++)
	    {
 var  itemVBrate = nlapiGetLineItemValue('item','rate',kd);
 var  ItemidVB = nlapiGetLineItemValue('item','item',kd);

for(mm =1;  mm <= irrec.getLineItemCount('item'); mm++)
	{ 
      
   var itemIR = irrec.getLineItemValue('item','item',mm);  
     
   var itemIRrate = irrec.getLineItemValue('item','rate',mm);  
  // if( itemIR == ItemidVB && itemIRrate!=itemVBrate  ){alert(ItemidVB + " " + itemIR  ); alert("vbrate " + itemVBrate + " " + "irrate " + itemIRrate);}
      // alert("vbrate " + itemVBrate + "  " + ItemidVB); alert("irrate " + itemIRrate + "  " + itemIR);
      if(itemIR == ItemidVB && itemIR &&  ItemidVB && itemIRrate!=itemVBrate ) {  irrec.setLineItemValue('item','rate', mm, itemVBrate); break;}
    }


        }
nlapiSubmitRecord(irrec,false, true);
                }}
  
  
nlapiSubmitRecord(rec, false, true);
}