function trim(stringToTrim)
{
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}


function is_int(value) {
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
}

function ValidateCustomerCodes() {

var errMsg = "The following customer code values do no match the split invoice count: \n\n";
var errMsgL = errMsg.length;

var customerCodes = new Array("custbody8", "custbody9", "custbody10",
    "custbody74", "custbody38", "custbody11", "custbody69", "custbody73", "custbody67", "custbody87");
    
var customerCodesLabels = new Array("WellSite Name", "Well Number", "Accounting #",
    "GL Account", "Purchaser/Technician Name", "XTO Code", "Plant Code", "Approver ID", 
    "Reason Codes", "Online Paykey/UserID");

var numberofCopies = parseInt(nlapiGetFieldValue("custbody_totalnumberofchildinvoices"));

var fieldValue, mySplitResult;

var errFlag;

if (numberofCopies > 1) 
{    
    for (var i in customerCodes) 
    {
        errFlag = 0;
        fieldValue = nlapiGetFieldValue(customerCodes[i]);
        fieldValue = trim(fieldValue);
        mySplitResult = fieldValue.split(",");        
        if (fieldValue.length > 0) 
        {
            if (mySplitResult.length > 1) 
            {
                if (mySplitResult.length != numberofCopies) {
                    errFlag = 1;         
                }
                else 
                {
                    for (var x = 0; x < numberofCopies; x++) {
                        if (mySplitResult[x] != null) {
                            var str = trim(mySplitResult[x]);
                            if (str.length == 0) {
                                errFlag = 1;
                            }
                        }
                    }
                }
                if (errFlag == 1) {
                    errMsg = errMsg + customerCodesLabels[i] + ", ";
                }
            }
        }             
    }
     
    if (errMsg.length > errMsgL) 
    {
        errMsg = errMsg + "\n\nPlease ensure the total entries for each customer code field matches the split invoice count.";
        alert(errMsg);
        return false;
    }
}
    return true;
}

function ValidateLineItemQuantity() {

    var splitInvoiceCount = parseInt(nlapiGetFieldValue('custbody_totalnumberofchildinvoices'));

    if (!isNaN(splitInvoiceCount)) { 
        if (splitInvoiceCount > 0) {
//alert(8);
            for (var i = 1; i <= parseInt(nlapiGetLineItemCount('item')); i++) {
                var le = nlapiGetLineItemValue('item', 'item', i);
		var qty = parseInt(nlapiGetLineItemValue('item', 'quantity', i));
                var x = qty / splitInvoiceCount;
               if ((!is_int(x))&& (le != 0)) return false;
            }
        }
    }

    return true;
}

//-----------------------------------

function onsave(type)
{
  
  /////////////////////////////////////////////////////////////////create cust code summary 
    var a = nlapiGetFieldValue("otherrefnum");
  var b = nlapiGetFieldValue("custbody38");
  var c = nlapiGetFieldValue("custbody8");
  var d = nlapiGetFieldValue("custbody9");
  var e = nlapiGetFieldValue("custbody10");
  var f = nlapiGetFieldValue("custbody69");
  var g = nlapiGetFieldValue("custbody11");
  var h = nlapiGetFieldValue("custbody67");
  var i = nlapiGetFieldValue("custbody74");
  var j = nlapiGetFieldValue("custbody87");
  var k = nlapiGetFieldValue("custbody129");

 var customerCodeList = a +" " + b +" " + c  +" " + d  +" " + e +" " + f +" " + g +" " + h +" " + i +" " + j +" " + k;
  nlapiSetFieldValue("custbody204", customerCodeList.substring(0, 299));
  ////////////////////////////////////////////////////////////////////end cust code summary
/////////////////////////////////////////start create tos
  
 var Hloc = nlapiGetFieldValue('location');
var TOlocCount = 0;
var TOlocations = new Array();
 // var rectype = nlapiGetRecordType();
 // alert(rectype);
if(Hloc)
  {
    if(nlapiGetCurrentLineItemValue('item', 'item'))
      {
nlapiCommitLineItem('item');
      }
//////loop to create array of all location to create transfer for
     var lineCount = parseInt( nlapiGetLineItemCount('item'));
       for(x =1; x<=lineCount; x++)
	{
		var Lloc = nlapiGetLineItemValue('item', 'location', x);
        var createTO = "";
 if(  nlapiGetLineItemValue('item', 'custcol90', x)==5){createTO = "T";} else{createTO == nlapiGetLineItemValue('item', 'custcol76', x);}                          //to=2
      if(Lloc != Hloc && createTO )
        {
  if(TOlocations.indexOf(Lloc) == -1 && TOlocations)
  {    TOlocations.push(Lloc); }//alert("added " + Lloc); }
         //else { alert("skipped " +Lloc);  }


        }
	}

//alert(TOlocations);
/////start loop to create TO
       for(y =0; y<TOlocations.length && TOlocations; y++)
	{
   
  var currentToLocation =  TOlocations[y];
  var Itemsperlocation = 0;
      
////start total line count per location
    var lineCount = parseInt( nlapiGetLineItemCount('item'));
       for(z =1; z<=lineCount; z++)
	              {
var CTOLlocation = nlapiGetLineItemValue('item', 'location', z);
var CTOLocationava = nlapiGetLineItemValue('item', 'quantityavailable', z);
var CTOcreateTO =  ""; //nlapiGetLineItemValue('item', 'custcol76', z);
if(  nlapiGetLineItemValue('item', 'custcol90', z)==5){CTOcreateTO = "T";} else{CTOcreateTO == nlapiGetLineItemValue('item', 'custcol76', z);}


if(currentToLocation == CTOLlocation && CTOLocationava >0 && CTOcreateTO == "T"  )// && Hloc != CTOLlocation)
{
Itemsperlocation = Itemsperlocation +1;
}
//else if(currentToLocation == CTOLlocation && CTOcreateTO == "T" && (Hloc == CTOLlocation))
//{
//alert("The selected source location is the same as the destination location.  Line "+ z + " will not be added to a transfer order. ");
//}
else if(currentToLocation == CTOLlocation && CTOcreateTO == "T")
 {
alert("The selected location does not have stock avalible.  Line "+ z + " will not be added to a transfer order. ");
} 
                    }
////end check total line count per locaion
//alert(currentToLocation + " items " + Itemsperlocation);
var LinesOnTo= new Array();
      
if(Itemsperlocation > 0)
  {
   
//// start create new TO record.  
var newtransferorder = nlapiCreateRecord('transferorder');

    //set header fields
    newtransferorder.setFieldValue( 'location',  currentToLocation );
    newtransferorder.setFieldValue( 'transferlocation',  Hloc );
    newtransferorder.setFieldValue( 'employee',  nlapiGetUser() );
     newtransferorder.setFieldValue( 'orderstatus', "B"); 
 
////add line items to TO
    var lineCount = parseInt( nlapiGetLineItemCount('item'));
       for(m =1; m<=lineCount; m++)
	              {

var CTOLlocation = nlapiGetLineItemValue('item', 'location', m);
var CTOLocationava = parseInt(nlapiGetLineItemValue('item', 'quantityavailable', m));
                  //  alert(CTOLocationava);
var CTOcreateTO = ""; //nlapiGetLineItemValue('item', 'custcol76', m);
if(  nlapiGetLineItemValue('item', 'custcol90', m)==5){CTOcreateTO = "T"; } else{CTOcreateTO == nlapiGetLineItemValue('item', 'custcol76', m);}
var lineQTY = parseInt(nlapiGetLineItemValue('item', 'quantity', m));
var itemid = nlapiGetLineItemValue('item', 'item', m);
var TOqty = 0;
var TOitemcost = 0;
if(currentToLocation == CTOLlocation && CTOLocationava >0 && CTOcreateTO == "T" )
{

LinesOnTo.push(m);
//insert items
//alert("add line " +m)
		newtransferorder.selectNewLineItem('item');
        newtransferorder.setCurrentLineItemValue('item','item', itemid ,true);
  //alert("CTOLocationava " + CTOLocationava  +" lineqty " +lineQTY);
        if(lineQTY <= CTOLocationava){TOqty = lineQTY;} else if(lineQTY > CTOLocationava){TOqty = CTOLocationava;}
 // alert(TOqty); return false;
        newtransferorder.setCurrentLineItemValue('item','quantity', TOqty ,true);

//get avg cost
var itemType = nlapiGetLineItemValue('item', 'itemtype', m);
 var itemLookupType = '';
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

var record = nlapiLoadRecord( itemLookupType, itemid);
//var newcost = record.getFieldValue( 'averagecost');

var itemlocation = record.getLineItemCount('locations');
for(t =1; t<=itemlocation; t++)
	{
var invloc = record.getLineItemValue('locations', 'locationid',  t); 
	if(CTOLlocation==invloc)
		{
var invloccost = record.getLineItemValue('locations', 'averagecostmli',  t); 
	if(invloccost > 0) { TOitemcost = invloccost; }
    else if (newcost > 0){invloccost = record.getFieldValue( 'averagecost');}
    else{invloccost = record.getFieldValue('cost');}

        }

// end get avg cost
}
 newtransferorder.setCurrentLineItemValue('item','rate', invloccost ,true);
newtransferorder.commitLineItem('item');
}
}
                   

 
 var idd = nlapiSubmitRecord(newtransferorder, true); // newtransferorder.getFieldValue( 'tranid' );
 var response =  nlapiResolveURL('RECORD', 'transferorder',idd );

 var locName =  nlapiLookupField('location', currentToLocation , 'name' );
 alert("Transfer order submitted for " + locName  + ".  Consisting of " + Itemsperlocation + " item(s). The transfer order has been automatically opened on another tab.  Please review and fulfill. \n \n ");
    
/////////////update line location and link TO
    // alert(LinesOnTo.length);
  for(d =0; d < LinesOnTo.length && LinesOnTo; d++)
	{
  var LineToUpdate =  LinesOnTo[d];
    
  nlapiSelectLineItem( 'item', LineToUpdate );
  nlapiSetCurrentLineItemValue('item', 'custcol74', idd, false);
  nlapiSetCurrentLineItemValue('item', 'location',Hloc, false); 
  if(nlapiGetCurrentLineItemValue('item', 'custcol90')==5){nlapiSetCurrentLineItemValue('item', 'custcol90', '', false);}
  nlapiCommitLineItem('item'); 
//  nlapiCancelLineItem("item");
     }
////////////////////
 window.open(response); 
//nlapiGetRecordId()
  }
////end add line items to TO


    }
//return true;
  }
  
  
  
  
  
  ////////////////////////////////////////end create to
  
/////////////////////////////////////////////////////////////////////Check Credit Balance
// total / balance / unbilledorders / creditlimit
var cust = nlapiGetFieldValue("entity");
  if(cust)
    {
var fields = ['balance', 'unbilledorders', 'creditlimit'];
var columns = nlapiLookupField('customer', cust, fields);
var Cbalance = columns.balance;
var Cunbilledorders = columns.unbilledorders;
var Ccreditlimit = columns.creditlimit;
var Thisordertotal = 0;  if(!nlapiGetRecordId()){Thisordertotal = nlapiGetFieldValue("total");   }

var Ctotal = parseInt(Cbalance) + parseInt(Cunbilledorders) + parseInt(Thisordertotal);
var Creditremaining = parseInt(Ccreditlimit) - parseInt(Ctotal);

 // if(Creditremaining < 0 ){ alert('Warning: Customer balance of $'+  Ctotal +' exceeds credit limit of $'+ Ccreditlimit ); if(!nlapiGetRecordId() && nlapiGetRecordType() == 'salesorder'  ){ alert("Transaction can not be saved.  Please contact accounting for changes to creditlimits."); return false;}  }
    }
/////////////////////////////////////////////////////////////////

if(type == 'item')
		return true;

	var lineCount = parseInt( nlapiGetLineItemCount('item'));
	var addtocartitems = "";
	
	for(x =1; x<=lineCount; x++)
	{
      
////////////////////////////////////////////////on save quick item add
if( (nlapiGetLineItemText("item", "item", x).indexOf("-I.U.")!==-1  &&  nlapiGetLineItemText("item", "item",x ).indexOf("-I.U-S")==-1 &&   nlapiGetRecordType()== "salesorder") || (nlapiGetLineItemText("item", "item", x).indexOf("IN USE")!==-1  &&  nlapiGetLineItemText("item", "item",x ).indexOf("IN USE - SOLD")==-1 &&   nlapiGetRecordType()== "salesorder"))
{
  var newitemid =  nlapiGetLineItemValue("item", "item", x);
   var salesd =  nlapiGetLineItemValue("item", "description", x); 
  var NICF = nlapiGetFieldText("createdfrom");
  nlapiSubmitField('inventoryitem', newitemid, ['custitem66', 'displayname', "salesdescription" ], ["F" ,"IN USE - SOLD" , salesd ]);  //"IN USE"
}
//////////////////////////////////////////////// end on save quick item add
var ES = "";
      if( nlapiGetLineItemValue('item', 'custcol_linenumber', x,x).indexOf("ES")!=-1   ){ES = '-ES';  }
  !nlapiSetLineItemValue('item', 'custcol_linenumber', x,x+ES) 
        

                 var itemInternalID = nlapiGetLineItemValue('item', 'item',x);
                var qty = nlapiGetLineItemValue('item', 'quantity',x);
         if(qty >0)
{
                addtocartitems  = addtocartitems + itemInternalID+ "," + qty + ";" ;
}
	}

     nlapiSetFieldValue('custbody153', addtocartitems  );

//--------------Check to make sure there are not groups on SO that will be split-------------------

 var splitInvoiceCount = parseInt(nlapiGetFieldValue('custbody_totalnumberofchildinvoices'));
//alert(1);
 var itemtypecheck = 0;
 var lineCount = parseInt( nlapiGetLineItemCount('item'));

	for(x =1; x<=lineCount; x++)
	{

    var itemInternalID = nlapiGetLineItemValue('item', 'item',x);
    var itemType = nlapiGetLineItemValue('item', 'itemtype', x);
   
    var itemRecord = null;
    var itemLookupType = '';
    switch (itemType)
    {
      
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

	}

    if ( itemtypecheck > 0 &&  splitInvoiceCount > 0)
    {
        alert('Invoice Spliting does not work for kits or groups.  Please create multiple sales orders or set Split Invoice Count to blank.');
        return false;
    }


//-------------------------------------

if (!ValidateCustomerCodes()) {
        return false;
    }

if (!ValidateLineItemQuantity()) {
    alert("The quantity for each line item should equal the split invoice count.");
    return false;
}

return true;
}


//-----------------------------



//------------------------------


