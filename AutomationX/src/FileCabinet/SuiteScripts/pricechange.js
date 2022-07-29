function fFchange(type, name)
{

///////--------------------------------Set margin est field ----------------------------------
if(type === 'item' && name =='custcol61')
{

var margincalcfield = nlapiGetCurrentLineItemValue('item', 'custcol61');
if( margincalcfield >0   && margincalcfield*1 == margincalcfield && margincalcfield !="" )
{

var linepricechange =nlapiGetCurrentLineItemValue('item', 'price');
nlapiSetCurrentLineItemValue('item', 'custcol61', "",false);
var itemType = nlapiGetCurrentLineItemValue('item', 'itemtype');
var uid = nlapiGetCurrentLineItemValue('item', 'item');
var itemLookupType ="";

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
		itemtypecheck ++;
          break;
        case 'Group':
            itemLookupType = 'kititem';
		itemtypecheck ++;
          break;
    }

if( itemLookupType == 'inventoryitem' ||     itemLookupType == 'assemblyitem')
{

var itemRecord = nlapiLoadRecord(itemLookupType , uid);
var preferedvendorrate= itemRecord.getFieldValue('cost');
var itemaveragecost = itemRecord.getFieldValue('averagecost');
window.preferedvendorrate = preferedvendorrate;
window.itemaveragecost = itemaveragecost;

var  newPG = margincalcfield /100;
var newSP = (preferedvendorrate /(1- newPG )).toFixed(2);

var baseprice= itemRecord.getLineItemMatrixValue('price','price', 1 ,1);
var pricelevel =  itemRecord.getLineItemValue('price','pricelevel',1 );

if(parseInt(newSP ) >= parseInt(baseprice))
{
                          nlapiSetCurrentLineItemValue('item', 'price', pricelevel);
                          return true; 
}

var pricelevelprice = "";
var priceleveldiscount ="" ;   
var pricelevel =  "";

var pricelineCount = parseInt( itemRecord.getLineItemCount('price'));
	for(x =1; x<=pricelineCount; x++)
	{

var pricelevelprice = itemRecord.getLineItemMatrixValue('price','price', x ,1);
var priceleveldiscount =  itemRecord.getLineItemValue('price','discount',x );   
var pricelevel =  itemRecord.getLineItemValue('price','pricelevel',x );

if( newSP >=  pricelevelprice  && priceleveldiscount != null&&pricelevelprice !=null )
                 {
 pricelevel =  itemRecord.getLineItemValue('price','pricelevel',x); 

if(newSP !=  pricelevelprice )
                      {
                     var y = x-1;
                     pricelevel =  itemRecord.getLineItemValue('price','pricelevel',y ); 
                     pricelevelprice = itemRecord.getLineItemMatrixValue('price','price', y ,1);               
break;
                       }

                   }

       }
                      nlapiSetCurrentLineItemValue('item', 'price', pricelevel);

return true;

 }}}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(type === 'item' && name == 'price' )
	{

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
		itemtypecheck ++;
            return false;
        case 'Group':
            itemLookupType = 'kititem';
		itemtypecheck ++;
           return false;

    }

if( itemLookupType == 'inventoryitem' ||     itemLookupType == 'assemblyitem')
{

if( !window.preferedvendorrate)
{
window.preferedvendorrate  = nlapiLookupField(itemLookupType , uid, 'cost');
window.itemaveragecost  = nlapiLookupField(itemLookupType , uid, 'averagecost');
}

var itemrate = nlapiGetCurrentLineItemValue('item', 'rate');

var ppMargin = ((1- (window.preferedvendorrate/itemrate))*100).toFixed(2);
var avgcostMargin  =  ((1- (window.itemaveragecost /itemrate ))*100).toFixed(2);
var avgmargintext ="";
var purchasepricemargintext = "";

if(window.itemaveragecost > 0  )
{
var avgmargintext = "\nAC:"+ avgcostMargin  +"%";
}

if( itemLookupType != 'assemblyitem')
{
var purchasepricemargintext = "PP:" + ppMargin +"%\n ";
}
var marginfieldvalue = purchasepricemargintext + avgmargintext; 


nlapiSetCurrentLineItemValue('item', 'custcol61', marginfieldvalue,false );

window.preferedvendorrate ="";
window.itemaveragecost  = "";
	return true;
	}
}          
}