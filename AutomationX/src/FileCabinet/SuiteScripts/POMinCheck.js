function POminCheck()
{
  var lineCount = parseInt( nlapiGetLineItemCount('item'));
  	for(x =1; x<=lineCount; x++)
	{
      
////////////////////////////////////////////////on save quick item add
if( (nlapiGetLineItemText("item", "item", x).indexOf("-I.U.")!==-1  &&  nlapiGetLineItemText("item", "item",x ).indexOf("-I.U-S")==-1 ) || (nlapiGetLineItemText("item", "item", x).indexOf("IN USE")!==-1  &&  nlapiGetLineItemText("item", "item",x ).indexOf("IN USE - SOLD")==-1 &&   nlapiGetRecordType()== "salesorder"))
{
  var newitemid =  nlapiGetLineItemValue("item", "item", x);
   var salesd =  nlapiGetLineItemValue("item", "description", x); 
  var NICF = nlapiGetFieldText("createdfrom");
  nlapiSubmitField('inventoryitem', newitemid, ['custitem66', 'displayname', "salesdescription" ], ["F" ,"IN USE - SOLD" , salesd ]);  //"IN USE"
}
//////////////////////////////////////////////// end on save quick item add
	
	}

var vendors = nlapiGetFieldValue('entity');
  if(vendors){
var vendorminamount = nlapiLookupField('vendor', vendors, 'custentity259');
var POtotal = nlapiGetFieldValue('total');
var itemsundermin = 0;

var messagelines =  "Items do not meet the preferred Vendors minimum."  +" \n\n "
var messageamount = "";

if(Number(POtotal) < Number(vendorminamount))
{
var shortamount = Number(POtotal) - Number(vendorminamount );
var messageamount = "The Selected Vendor has a $" +vendorminamount + " minimum PO amount. The PO is currently $" +shortamount + " short. \n------------------------------------------------------------------------\n"  ;
}

var lineCount = nlapiGetLineItemCount('item');
	for(i =1; i<=lineCount; i++)
	{
    var itemType = nlapiGetLineItemValue('item', 'itemtype', i);
     if(itemType  == "InvtPart"  )
                   {
                var itemid = nlapiGetLineItemValue('item','item',i);
                var itemname = nlapiGetLineItemText('item','item',i);
                var qty = nlapiGetLineItemValue('item','quantity',i);
		        var minqty =""; //nlapiLookupField('inventoryitem', itemid , 'custitem_vlgx_vendor_min');  //Commented out on 7/5/18 because custitem_vlgx_vendor_min DNE and so the PO's(eg POFMN19760) could not be saved.
                  }



if( Number( qty ) < Number(minqty ))
{
itemsundermin ++;
messagelines = messagelines  + "Line: "+  i + " Preferred Vendor Minimum QTY: " +minqty + "\n" + itemname +"\n***************************************************************************\n" ;

}


         }



if(itemsundermin >0 ||( Number(POtotal) < Number(vendorminamount )))
{

var message = messageamount  + messagelines ;
alert(message);
}}
return true;


}