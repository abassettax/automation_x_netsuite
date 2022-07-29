function postsourcedmargin(type, name)

{

if(type === 'item' && name == 'item' && nlapiGetFieldValue('customform') != 303   )
	{

 var lineloc = nlapiGetCurrentLineItemValue('item', 'location');
      //alert(lineloc);
 nlapiSetCurrentLineItemValue('item', 'location',lineloc);
   
    
      
if(window.oneanddone == 1)
{
window.oneanddone = 0;

  return false;
}
    
nlapiSetCurrentLineItemValue('item', 'custcol61', "",false);

var linepricegroup=nlapiGetCurrentLineItemValue('item', 'price')
if(linepricegroup <0)
{
nlapiSetCurrentLineItemValue('item', 'custcol61', "Please enter a target margin or select a price level to see margin.",false);
return true;
}
   

var margincalcfield = nlapiGetCurrentLineItemValue('item', 'custcol61');

var itemType = nlapiGetCurrentLineItemValue('item', 'itemtype');
var itemLookupType ="";

var uid = nlapiGetCurrentLineItemValue('item', 'item');
  
 switch (itemType)
    {

        case 'InvtPart':
            itemLookupType = 'inventoryitem';
            break;
        case 'Assembly':
            itemLookupType = 'assemblyitem';
            break;
        case 'Kit':
            itemLookupType = 'kititem';
break;
        case 'Group':
            itemLookupType = 'kititem';
break;

    }

if( itemLookupType == 'inventoryitem' ||     itemLookupType == 'assemblyitem')
{

if( !window.preferedvendorrate && uid)
{
//window.preferedvendorrate  = nlapiLookupField(itemLookupType , uid, 'cost');
//window.itemaveragecost  = nlapiLookupField(itemLookupType , uid, 'averagecost');
  
   ////look for location average cost
window.labelac = "AC:";
  var linelocation = nlapiGetCurrentLineItemValue('item', 'location');

    if(linelocation)
    {
 var columnsACps = new Array();
columnsACps[0] = new nlobjSearchColumn("locationaveragecost",null,null);
columnsACps[1] = new nlobjSearchColumn("averagecost",null,null);
columnsACps[2] = new nlobjSearchColumn("cost",null,null);
columnsACps[3] = new nlobjSearchColumn("custitem46", null,null); 
columnsACps[4] = new nlobjSearchColumn("custitem50", null,null); 
columnsACps[5] = new nlobjSearchColumn("locationpreferredstocklevel", null,null);       
      
var itemSearchACps = nlapiSearchRecord("item",null,
[
   ["inventorylocation","anyof",linelocation], 
   "AND", 
   ["internalidnumber","equalto", uid]
], 
columnsACps
);

var locationac = 0;
       window.source  =  itemSearchACps[0].getValue(columnsACps[3]);
         window.lastNegotiationDate =  itemSearchACps[0].getValue(columnsACps[4]);
if(itemSearchACps)
  {
 locationac = itemSearchACps[0].getValue(columnsACps[0]);
 window.preferedvendorrate  = itemSearchACps[0].getValue(columnsACps[2]);
 window.itemaveragecost  = itemSearchACps[0].getValue(columnsACps[1]);
  window.isStocked  = itemSearchACps[0].getValue(columnsACps[5]);   
  }
      
      


 
             var itemSource = window.source;
if(itemSource == 2 && window.itemaveragecost )
{
 nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'AVGCOST' ,false,true );   
}
 else
   {
    
var lineQty = nlapiGetCurrentLineItemValue('item', 'quantity');
var qtyAva = nlapiGetCurrentLineItemValue('item', 'quantityavailable');
 
if( parseInt(locationac)>= parseInt(lineQty) && locationac){  nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'AVGCOST'  );   }else{nlapiSetCurrentLineItemValue('item', 'costestimatetype', 'PURCHPRICE' ,false,true ); }

   }
      
  if(locationac > 0)
  { window.itemaveragecost = locationac;  window.labelac = "LAC:"; } //alert(locationac); }

 /// end location average cost 
    }

var itemrate = nlapiGetCurrentLineItemValue('item', 'rate');

var ppMargin = ((1- (window.preferedvendorrate/itemrate))*100).toFixed(2); //-2
var avgcostMargin  =  ((1- (window.itemaveragecost /itemrate ))*100).toFixed(2);
var avgmargintext ="";
var purchasepricemargintext = "";

if(window.itemaveragecost > 0  )
{
var avgmargintext = window.labelac + avgcostMargin  +"%";
}

if( itemLookupType != 'assemblyitem')
{
  //alert(1);
var purchasepricemargintext = "\nPP:" + ppMargin +"%\n ";
}

 var LastNegoshDate = window.lastNegotiationDate;
  
 var isstockedlocal = "Non-Stock" +  ".\n";
 if( parseInt(window.isStocked) > 0  ){isstockedlocal = 'Stocked' +'.\n';}

  var marginfieldvalue = purchasepricemargintext + avgmargintext   +  "\n" + isstockedlocal + ' \n ' + " " +  LastNegoshDate ; 
  
nlapiSetCurrentLineItemValue('item', 'custcol61', marginfieldvalue,false );
  window.oneanddone = 1;
// if( nlapiGetRole() == 3){ alert("2 " + marginfieldvalue);}
  
  }
  window.lastNegotiationDate="";
window.preferedvendorrate ="";
window.itemaveragecost  = "";
   window.source ="";
  window.isStocked ="";
	return true;
	}





}
  
  return true;
}
