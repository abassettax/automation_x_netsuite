function fchange(type,name)
{
  ////////////////////check drop ship addresses.
  if(name=='custbody147' &&  nlapiGetFieldValue('custbody147')=='T' )
    {
  var recid= nlapiGetRecordId();
  if(recid)
  {
    
    var columnsD = new Array();
       columnsD[0] =   new nlobjSearchColumn("formulatext",null,"GROUP").setFormula("{custrecord_po_so_linkage_so.shipaddress}").setSort(false);

        var purchaseorderSearch = nlapiSearchRecord("customrecord_dh_po_so_linkage",null,
         [["custrecord_po_so_linkage_po.internalidnumber","equalto",recid ]], 
         columnsD
         );
var searchlength = 0;  if( purchaseorderSearch ) {searchlength = purchaseorderSearch.length;  }
    if(searchlength > 1 || !purchaseorderSearch){alert('This PO has multiple Sales Order with different ship to addresses or is not Linked to a Sales Order. Please update/add sales order addresses to match.'); }
    else{
var soaddress ="";
var linkedSO = "";
      for ( var b = 0; purchaseorderSearch != null && b < searchlength; b++ )
          {
           soaddress = purchaseorderSearch[b].getValue(columnsD[0]);
          }

     nlapiSetFieldValue('shipaddress', soaddress); 
      }
  }
    }
   if(name=='custbody198')
{
 nlapiSetFieldValue('shipdate', nlapiGetFieldValue('custbody198'));
}
  /////////////////////////
 if(name=='custbody70' && nlapiGetFieldValue('custbody70')=='T' )
{
alert("Expedite Purchase Orders should be shipping something other than ground or have a specific need by date.  Please Change the shipping method and/or provide additional information in the purchasing notes."  );
}
 /////////////////////////// 
  if(name=='custbody181' && nlapiGetFieldValue('custbody181')=='T' )
{
 
  var thistext =" Please include the following: \n\n-Line#:\n- Vendor Part# Shipped:\n-Attach Packing Slip:\n\nGeneral Description:   "
 nlapiSetFieldValue('custbody182', thistext);

}
  
if(name =='entity' &&  nlapiGetFieldValue('entity') != "")
{
var ven = nlapiGetFieldValue('entity');
var userrole = nlapiGetRole();
var  IsInternational = nlapiLookupField('vendor', ven,'custentity_as_intl_supplier');
if( IsInternational == "T" && (userrole  != 1052 && userrole  != 3 && userrole  != 1115))  
{
nlapiSetFieldValue('entity',"",false,true)
  return true;
}}

if(name =='rate' )
	{
nlapiSetFieldValue('custbody157', "T");
      }
// if(name =='shipdate' || name =='custbody6' )
// 	{

// nlapiSetFieldValue('custbody90', "T");
	
//       }


// if(name == 'shipdate')
// {
//         var ShipingDate = nlapiGetFieldValue('shipdate');

//         var lineCount = parseInt( nlapiGetLineItemCount('item'));
// 	for(x =1; x<=lineCount; x++)
// 	{
// 		nlapiSetLineItemValue('item', 'custcol11', x, ShipingDate );
		
// 	}

// }

if(name =='entity')
{
// var ven = nlapiGetFieldValue('entity');
var userRole = nlapiGetRole();
// alert(userRole);
var allowedRoles = [3,1052,1115,1003,1060,1054];
// alert(allowedRoles.indexOf(parseInt(userRole)));
if (allowedRoles.indexOf(parseInt(userRole)) == -1) {
  alert("Your role does not have permission to change the Vendor on Credit Card POs. Please create new POs using Purchase Requests from Sales Order lines or standalone Purchase Requests for Stock Requests. Resetting the Vendor to Credit Card Purchase Tracker %.");
nlapiSetFieldValue('entity',"2491", false, null);  //always set entity to CC Tracker on change if user is not in list
  return true;
}}

}



////////////////////////////////////////////////////////////////////////////////////////
function linenumber(type)
{


	if(type != 'item')
		return true;


	var lineCount = parseInt( nlapiGetLineItemCount('item'));

	for(x =1; x<=lineCount; x++)
	{
		nlapiSetLineItemValue('item', 'custcol_linenumber', x,x);
		
	}
	
	return true;
}
