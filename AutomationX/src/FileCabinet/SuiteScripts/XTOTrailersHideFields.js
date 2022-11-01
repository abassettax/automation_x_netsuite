function TimeDelay(){
  debugger;
 if( (nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362) && nlapiGetCurrentLineItemValue('item', 'quantityavailable' ) < nlapiGetCurrentLineItemValue('item', 'quantity' ) ){
  alert( "STOCK ALERT\n\nThere is not enough avalible quantity to complete this line.  Please double check your part number or reduce the quantity to be less than or equal to Senecas available stock."); return false;} 
  return true; 
  
}

function valLine(type, name)
{
  if( nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362){ nlapiSetCurrentLineItemValue('item', 'location',69 ); } //
  if( nlapiGetFieldValue('customform') == 364){ nlapiSetCurrentLineItemValue('item', 'location',211 ); } //
   
if( (nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362) && ( //AX Seneca Sales Order form 
	parseInt(nlapiGetCurrentLineItemValue('item', 'quantityavailable' )) < 				parseInt(nlapiGetCurrentLineItemValue('item', 'quantity' ))))
{
   
 alert("STOCK ALERT\n\nThere is not enough avalible quantity to complete this line.  Please double check your part number or reduce the quantity to be less than or equal to Senecas available stock.");
 return false;
}
if( (nlapiGetFieldValue('customform') == 364) && ( //AX Enlink Sales Order form 
	parseInt(nlapiGetCurrentLineItemValue('item', 'quantityavailable' )) < 				parseInt(nlapiGetCurrentLineItemValue('item', 'quantity' ))))
{
   
 alert("STOCK ALERT\n\nThere is not enough avalible quantity to complete this line.  Please double check your part number or reduce the quantity to be less than or equal to the available stock.");
 return false;
} 
  return true;
}

function fchangesen(type, name)
{
 

  
 if(name == 'custbody213' /*AFE/LOE*/ && (nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362)     )
   { 
   
  var afeField= document.getElementById('custbody214_fs');
   var afeFieldLabel= document.getElementById('custbody214_fs_lbl_uir_label');
  
    var loeField= document.getElementById('custbody215_fs');
   var loeFieldLabel= document.getElementById('custbody215_fs_lbl_uir_label'); 
     

 
 
 /////////////afe
if(afeField && nlapiGetFieldValue('custbody213') == 2 ){afeField.style.display = 'none'; afeFieldLabel.style.display = 'none';   nlapiSetFieldValue('custbody214', ''); } //  
  
if(afeField && nlapiGetFieldValue('custbody213') == 1 ){afeField.style.display = ''; afeFieldLabel.style.display = 'list-item';  nlapiSetFieldText('custbody214', 'ICC- MISCELLANEOUS 1400-1220-1810')}; 
 ////////// end afe}  //
 //
 //LOE
if(loeField && nlapiGetFieldValue('custbody213') == 1 ){loeField.style.display = 'none'; loeFieldLabel.style.display = 'none';   nlapiSetFieldValue('custbody215', "");     } 
  
if(loeField && nlapiGetFieldValue('custbody213') == 2 ){loeField.style.display = ''; loeFieldLabel.style.display = 'list-item';  nlapiSetFieldValue('custbody215', '1'); }  
 //End LOE
  }
 
 // if(name == 'Item') {nlapiSetCurrentLineItemValue('item', 'location',69 );}
   return true; 
 
}


function XTOOnsavepopup()
{
  alert( "Your request has been processed. Please contact Automation-X with any questions or to report any pending stock outs.");
  
//window.open("https://422523/app/accounting/transactions/salesord.nl");
return true;
}

function POSpageInt()
{ 
//alert(nlapiGetContext());
//debugger;
    var tran = nlapiGetFieldValue('tranid');
 
if(tran == 'To Be Generated' ){         nlapiSetFieldValue('custbody173',nlapiGetContext().getContact() );                   nlapiSetFieldValue('custbody35', nlapiLookupField('contact', nlapiGetContext().getContact(), 'entityid') ); }

if(nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362 || nlapiGetFieldValue('customform') == 364) //
{  
 var loeField= document.getElementById('custbody215_fs');
  var loeFieldLabel= document.getElementById('custbody215_fs_lbl_uir_label');  //
  if(loeField && nlapiGetFieldValue('custbody213') == 1 ){loeField.style.display = 'none'; loeFieldLabel.style.display = 'none'; }
}
  //////////////////////////////////////

  
  
//   var headerIcon= document.getElementById('ns-header-menu-home-item0');
// if(headerIcon){headerIcon.style.display = 'none'; }
  
//   var headerIcontwo= document.getElementById('ns-header-menu-home');
// if(headerIcontwo){headerIcontwo.style.display = 'none'; }  
   
  var SigButton= document.getElementById('tbl_custpagesi_sigcapturebtn');
if(SigButton){SigButton.style.display = 'none'; }  
  
   var SigButtonBottom= document.getElementById('tbl_secondarycustpagesi_sigcapturebtn');
if(SigButtonBottom){SigButtonBottom.style.display = 'none'; }

var avaButton1= document.getElementById('tbl_custpage_ava_calculatetax');
if(avaButton1){avaButton1.style.display = 'none'; }

var avaButton2= document.getElementById('tbl_custpage_ava_validatebillto');
if(avaButton2){avaButton2.style.display = 'none'; }

var avaButton3= document.getElementById('tbl_custpage_ava_validateshipto');
if(avaButton3){avaButton3.style.display = 'none'; }

var avaButton4= document.getElementById('tbl_secondarycustpage_ava_calculatetax');
if(avaButton4){avaButton4.style.display = 'none'; }

var avaButton5= document.getElementById('tbl_secondarycustpage_ava_validatebillto');
if(avaButton5){avaButton5.style.display = 'none'; }

var avaButton6= document.getElementById('tbl_secondarycustpage_ava_validateshipto');
if(avaButton6){avaButton6.style.display = 'none'; }
  
var ListLink= document.getElementById('NS_MENU_ID0'); 
if(ListLink){ListLink.style.display = 'none'; }

var ItemPane = document.getElementById('item_pane_hd');
  if(ItemPane){ItemPane.style.display = 'none'; }
  
//var Billing = document.getElementById('billingtab_pane');
 // if(Billing){Billing.style.display = 'none'; }
  
  if(document.getElementsByClassName('totallingbg')!=null) // && nlapiGetFieldValue('customform') == 346
  {
  document.getElementsByClassName('totallingbg')[0].style.display = "none";
  }
var transactioninternalid = nlapiGetFieldValue('tranid');
  if(transactioninternalid == 'To Be Generated')
   {
     
var Shipcarrier = nlapiGetFieldValue('shipcarrier');
var Shipmethod = 4605; //nlapiGetFieldText('shipmethod');
var source = nlapiGetFieldValue('custbody125');
 
     nlapiSetFieldValue( 'shipcarrier',  'nonups'  , null, true );
     nlapiSetFieldValue( 'shipmethod',  4605, null, true );
     nlapiSetFieldValue( 'custbody125',  14); //10=walkin
     nlapiSetFieldValue( 'custbody68',  20);
 
//nlapiSetCurrentLineItemValue('item', 'location',nlapiGetFieldValue('location') );
//if( nlapiGetFieldValue('customform') == 364 ){nlapiSetCurrentLineItemValue('item', 'location', 47 ); }
//if( nlapiGetFieldValue('customform') == 347 ){nlapiSetCurrentLineItemValue('item', 'location', 69 ); }
}

if( nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362 || nlapiGetFieldValue('customform') == 364){ 
  nlapiSetFieldValue('terms', 2 ); //set terms to Net 30. Should keep payment method null
  try {
    nlapiGetField('ccsave' ).setDisplayType('hidden');
    nlapiGetField('ccdefault' ).setDisplayType('hidden');
  } catch (e) {
    //do nothing
  }
}

}



function POSlineInt()
{
  // var headerlocation = nlapiGetFieldValue('location');
 // debugger;
// nlapiSetCurrentLineItemValue('location', nlapiLookupField('contact', nlapiGetContext().getContact(), 'entityid'));
// nlapiSetCurrentLineItemValue('item', 'location', headerlocation, false, false);
if( nlapiGetFieldValue('customform') == 364 ){nlapiSetCurrentLineItemValue('item', 'location', 211 ); } //Enlink
if( nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362 ){ nlapiSetCurrentLineItemValue('item', 'location',69 ); } //XTO
return true;
}



function saverecsen()
{
// if( nlapiGetFieldValue('customform') == 347 || nlapiGetFieldValue('customform') == 362 || nlapiGetFieldValue('customform') == 364){ nlapiSetFieldValue('terms', 2 ); } //Seneca set terms to Net 30. Should keep payment method null
return true;
}