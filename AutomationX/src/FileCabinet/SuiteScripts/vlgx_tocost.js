function beforeloadview (type,name)
{
if(type == "view")
 { 
   var NSFFbutton = form.getButton('process');
   if(NSFFbutton)
     {
form.addButton('custpage_priceandff', 'Fullfill.', 'ffresetcost()');
form.setScript('customscript1436');
       
//NSFFbutton.setVisible(false);
     }
 }  
}



function toitemcostpsourcevlgx(type,name)
{
nlapiSetFieldValue('class', 38);
nlapiSetFieldValue('shippingcost', 0);

var sourceLocation = nlapiGetFieldValue('location');
var lineCount = nlapiGetLineItemCount('item');

  for ( x = 1; x <= lineCount; x++)
	{
  var avgCost =  nlapiGetLineItemValue('item', 'averagecost', x);
 if(avgCost){ nlapiSetLineItemValue('item', 'rate' , x, avgCost);}
    }
}


function aftersubmitTO(type,name)
{
   if(type == 'create' && nlapiGetFieldValue('custbody_siq_po_number') )
     {
     
     var ff = nlapiTransformRecord('transferorder', nlapiGetRecordId(), 'itemfulfillment');

    nlapiSubmitRecord(ff);    
     } 
  if(type !='delete')
    {
  var toRec = nlapiLoadRecord('transferorder',nlapiGetRecordId());
toRec.setFieldValue('class', 38);
toRec.setFieldValue('shippingcost', 0);

var sourceLocation = toRec.getFieldValue('location');
var lineCount = toRec.getLineItemCount('item');

  for ( x = 1; x <= lineCount; x++)
	{
  var avgCost = toRec.getLineItemValue('item', 'averagecost', x);
 if(avgCost){toRec.setLineItemValue('item', 'rate' , x, avgCost);}
    }
  nlapiSubmitRecord(toRec);
    }
}



/*
for ( x = 1; x <= lineCount; x++)
	{
	var uid = nlapiGetLineItemValue('item', 'item', x);
	var itemType = nlapiGetLineItemValue('item', 'itemtype', x);
    var itemLookupType = 'inventoryitem';

if(itemType!= 'InvtPart')
{
     switch (itemType)
    {
        case 'InvtPart':
            itemLookupType = 'inventoryitem';
            break;
        case 'NonInvtPart':
            itemLookupType = 'noninventoryitem';
            break;
        case 'Assembly':
            itemLookupType = 'assemblyitem';
            break;
        case 'Kit':
            itemLookupType = 'kititem';
            break;
    }
}
      
var record = nlapiLoadRecord( itemLookupType, uid);
var newcost =  nlapiGetLineItemValue('item', 'averagecost', x);if(!newcost){newcost=0;}
var isDead = "F";
  
for(i =1; i<=record.getLineItemCount('locations'); i++)
	{
var invloc =  record.getLineItemValue('locations', 'locationid',  i); 

	if(sourceLocation==invloc)
		 {
var invTotalValue = record.getLineItemValue('locations', 'onhandvaluemli',  i);
var invQtyOnHand =  record.getLineItemValue('locations', 'quantityavailable',  i); 
nlapiLogExecution('debug', 'invTotalValue ', invTotalValue +'--' + uid); 
nlapiLogExecution('debug', 'invQtyOnHand ', invQtyOnHand +'--' + uid); 
	if(invTotalValue <.01 )
		{
isDead = "T";
		}
           
nlapiLogExecution('debug', 'isDead ', isDead +'--' + uid); 
if(isDead=="T" ){newcost =0;  }

nlapiSelectLineItem('item', x);
nlapiSetCurrentLineItemValue('item', 'rate', newcost  );
nlapiCommitLineItem('item');
            break;
         }
 
}
}
}*/