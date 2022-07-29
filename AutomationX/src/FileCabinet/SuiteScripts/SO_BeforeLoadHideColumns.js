function HideSOColumns(type, form)  
{

  
  if(type == 'view')
    {
   form.addButton('custpage_stagingbutton', 'Print Staging Label', 'printstaginglabel()');  
 form.setScript('customscript350'); // sets the script on the client side

      if( nlapiGetFieldValue("status") != 'Closed' && nlapiGetFieldValue("status")!= 'Billed'){ form.addButton('custpage_axclose', 'Close Order', 'axClose()');   form.setScript('customscript350');} // sets the script on the client side
    }

//////////////////////PO set up SO
  var user = nlapiGetUser();
  var userclass = 1; // nlapiLookupField('employee', user, 'class');
  var darren = 30448;
  var hasitemsublist = form.getSubList('item');
  
  //custbody200
  var isprocessing = 0;
  var amountCommit = 0;
     var lineCount = parseInt( nlapiGetLineItemCount('item'));
       for(x =1; x<=lineCount; x++)
	{
if((nlapiGetLineItemValue('item','custcol91',x) == 1000   || nlapiGetLineItemValue('item','custcol90',x)   ) && nlapiGetLineItemValue('item','item',x)!= 1277 ){isprocessing = 1; nlapiLogExecution('Debug', 'isprocessing', isprocessing); break;}
    }
    //////////// show processing  message
/*if(isprocessing ==1 && user != 3354 && user != 28538  && user != 28816 )//////////////////////////  ADD USERS YOU WANT TO BE ABLE TO FIX / MODIFY SOs with Purchase requests processing
  {
  var processingmessage =form.getField('custbody200'); 
   if(processingmessage){processingmessage.setDisplayType('normal'); processingmessage.setDisplayType('inline').setLabel(""); form.removeButton('edit');}  // remove edit button until requests finish processing
    if(type=='edit'){nlapiSetRedirectURL('record', 'salesorder', nlapiGetRecordId(), false);}
  }*/
  ////////////end show processing  message 

  if(1 ==1)
  {   
   if(type =='view')
 {
   
    var relatedtext =  nlapiGetLineItemField('item','custcol92'); 
    if(relatedtext){relatedtext.setDisplayType('hidden');}
   
   var speclink =   nlapiGetLineItemField('item','createspecordpo'); 
   if(speclink){speclink.setDisplayType('hidden');}
   
    var purchrequestDropdown =   nlapiGetLineItemField('item', 'custcol90'); 
   if(purchrequestDropdown){purchrequestDropdown.setDisplayType('hidden');}
 } 
   if(type !='view')
 {
          var hideoldTocheckbox =  nlapiGetLineItemField('item','custcol76'); /// old create TO checkbox
    if(hideoldTocheckbox){hideoldTocheckbox.setDisplayType('hidden');}
   
    var relatedlink = nlapiGetLineItemField('item','custcol74'); 
    //if(relatedlink){relatedlink.setDisplayType('hidden');}
 } 
  }
 /////////////////////////////////////////////////////////////////////////////////////////////////// 

if(userclass ==1)
  { 
 var NSPOfield =     nlapiGetLineItemField('item','createpo'); 
 var DropSHip =     nlapiGetLineItemField('item','custcol4'); 

   if(NSPOfield){NSPOfield.setDisplayType('hidden');}
   if(DropSHip){DropSHip.setDisplayType('hidden'); }
  }
 /////////////////////////////////////

  ////////////////////End PO set up SO

var cust = nlapiGetFieldValue('entity');
     // 
var axholdstatus ="";
 if(cust){axholdstatus = nlapiLookupField('customer', cust, 'custentity327' );}

/////////////////////////////////////////////////////////////////////Check Credit Balance
// total / balance / unbilledorders / creditlimit
  if(cust)
    {
var fields = ['balance', 'unbilledorders', 'consolbalance', 'consolunbilledorders', 'creditlimit', 'parent'];
var columns = nlapiLookupField('customer', cust, fields);
var Cbalance = columns.balance;
var Cunbilledorders = columns.unbilledorders;
var Ccreditlimit = columns.creditlimit;
var Cparent = columns.parent;
var ConBalance = columns.consolbalance;
var ConUnbilledorders = columns.consolunbilledorders;

      if(!Ccreditlimit && Cparent ){Ccreditlimit =  nlapiLookupField('customer', Cparent, 'creditlimit');  Cbalance = ConBalance;  Cunbilledorders=ConUnbilledorders; }
var Thisordertotal = 0;  if(!nlapiGetRecordId()){Thisordertotal = nlapiGetFieldValue("total");   }

      
nlapiLogExecution('Debug', 'Cbalance', Cbalance);
      
var Ctotal = parseInt(Cbalance) ;
if(!Ctotal ){ Ctotal =0;}
      if(Cparent){ cust=Cparent;}
var creditmes ="";
      //////////FF orders search
      var salesorderSearch = nlapiSearchRecord("salesorder",null,
[
   ["type","anyof","SalesOrd"], 
   "AND", 
   ["closed","is","F"], 
   "AND", 
   ["status","anyof","SalesOrd:F","SalesOrd:E","SalesOrd:D"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["formulanumeric: CASE WHEN {quantitypicked} > {quantitybilled} THEN 1 ELSE 0 END","equalto","1"], 
   "AND", 
   ["customer.internalidnumber","equalto",cust]
], 
[
   new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("({quantitypicked} - {quantitybilled}) * {rate}")
]
);
      /////////////////end search
      var ffOrders = 0;
      if(salesorderSearch){if(salesorderSearch[0].getValue("formulanumeric",null,"SUM") > 0) {ffOrders = salesorderSearch[0].getValue("formulanumeric",null,"SUM");   }    }
      
        var amountCommit = 0;
     var lineCount = parseInt( nlapiGetLineItemCount('item'));
       for(h =1; h<=lineCount; h++)
	{
      var qtyCom = parseInt(nlapiGetLineItemValue('item','quantitycommitted',h));
 if(qtyCom >0 ){amountCommit   +=  nlapiGetLineItemValue('item','rate',h)* qtyCom;}
    }
      
      var amountTransaction = nlapiGetFieldValue("total");
       nlapiLogExecution('Debug', 'parseInt(Ccreditlimit) - parseInt(Ctotal) -  parseInt(ffOrders) - parseInt(amountCommit)',   parseInt(Ccreditlimit) - parseInt(Ctotal)  - parseInt(amountCommit) - parseInt(amountCommit) );
      
      var Creditremaining = parseInt(Ccreditlimit) - parseInt(Ctotal) -  parseInt(ffOrders) - parseInt(amountCommit) ; //   parseInt(Cunbilledorders)
      nlapiLogExecution('Debug', 'Creditremaining', Creditremaining);
      
      nlapiLogExecution('Debug', 'Creditremaining',      'Creditremaining ' + Creditremaining + ' Ctotal  ' +Ctotal          + ' ffOrders  ' +   ffOrders        + ' amountTransaction  ' +      parseInt(amountTransaction)                               );
  if(Creditremaining < 0 ){ creditmes = "Customer has exceeded credit limit. Order can not be fulfilled. Please contact accounting to discuss solutions. <br/><br/>  " ;}

      var forms = nlapiGetFieldValue('customform');    
form.removeButton('submitfulfill');form.removeButton('autofill');}
/////////////////////////////////////////////////////////////////
  if(  axholdstatus == 3 ||  axholdstatus == 4 ||  axholdstatus == 9  || axholdstatus == 7 || Creditremaining < 0)
    {

var holdmessage = "<div> <font size=\"2\" ><B>";
var searchURL ="";
       if(type =='edit')
 {
searchURL = ' <button style =\"border-radius: 3px;  width:80%; height:100%; background-color:#F2F2F2; \"     id=\"custformbutton_customscript350_9\" name=\"custformbutton_customscript350_9\" onclick=\"nsapiButtonCall(\'button\', \'customscript350\', \'viewpastdue\'); return false;\" >Click to View Past Due Invoices  </button>';
 
 }
  else if(type =='create'){searchURL ='<a href=\"https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=4870\"  target=\"_blank\">Click Here To View Past Customer Report</a>'}   //https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=4870
  else{ searchURL = "Click EDIT to view past due invoices."  }



var softholdmessage = "Customer account is Past Due and has been placed on <u>SOFT CREDIT HOLD</u>.  Please contact accounting to lift the hold for the remanider of the day.<br/><br/>";
var onholdmessage = "Customer account is Past Due and has been placed on <u>CREDIT HOLD</u>. Please resolve outstanding invoces before processing order.<br/><br/>";
var forceholdmessage ="Customer account is Past Due and has been placed on <u>HARD CREDIT HOLD</u>. Please contact accounting.<br/><br/>";

      if(Creditremaining < 0){holdmessage += creditmes;  }
        if( axholdstatus == 3) {holdmessage += softholdmessage; holdmessage += searchURL;}
        if( axholdstatus == 4) {holdmessage += onholdmessage; holdmessage += searchURL;}
        if( axholdstatus == 9) {holdmessage += forceholdmessage; holdmessage += searchURL;}

holdmessage += "</b></font></div >";
    // nlapiLogExecution('Debug', 'holdmessage', holdmessage);
 nlapiSetFieldValue('custbody172', holdmessage);

      
var forms = nlapiGetFieldValue('customform');
form.removeButton('submitfulfill');
form.removeButton('process');

   //nlapiLogExecution('Debug', 'axholdstatus', axholdstatus);
    }
      
    
  
  //Hour Hold Lift   1  
//Day Hold Lift   2  
//Soft Hold   3  // 
//On Hold   4  
//Off Hold   5  
//Credit Limit Soft Hold   6  
//Credit Limit Hold 7
// forced hold 9  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
var forms = nlapiGetFieldValue('customform');
var SOID = nlapiGetFieldValue('tranid');

  
 if(type =='view')
 {
       var hidemerge =  form.getField('custbody180'); 
    if(hidemerge){hidemerge.setDisplayType('hidden');}
   
    var possig =  form.getField('custbody139'); 
    if(possig){possig.setDisplayType('hidden');}
   
       var buttonsone =  form.getField('custbody163'); 
    if(buttonsone){buttonsone.setDisplayType('hidden');}
   
       var buttonstwo =  form.getField('custbody178'); 
    if(buttonstwo){buttonstwo.setDisplayType('hidden');}
 } 
  

var hasitemsublist = form.getSubList('item');
if(hasitemsublist)
  {
var fa =   form.getSubList('item').getField('quantitycommitted'); 
var fb =   form.getSubList('item').getField('quantityfulfilled');  
var fc =   form.getSubList('item').getField('quantitybilled');
var fd =   form.getSubList('item').getField('quantitybackordered');
var fe =   form.getSubList('item').getField('createpo');  
var ff =   form.getSubList('item').getField('createwo');
var OLDPOLINK =  nlapiGetLineItemField('item','createpo'); 
//var fg =   form.getSubList('item').getField('custcol92'); 
var fh =   form.getSubList('item').getField('custcol77');  //createspecordpo
var fm =   form.getSubList('item').getField('custcol96');

//
if((fe && type != "view") && ( userclass ==1 )){fe.setDisplayType('hidden');}  //&& ( userclass ==1  || userclass == 51 || userclass == 39  || userclass == 31 || userclass == 25 || userclass == 43  || userclass == 40 || userclass == 65  || userclass == 73  || userclass == 72) ) //PO show link to create POs   
    
 if(SOID != "To Be Generated"    )
   {
   if(fa){fa.setDisplayType('hidden');}
   if(fb){fb.setDisplayType('hidden');}
   if(fc){fc.setDisplayType('hidden');}
   if(fd){fd.setDisplayType('hidden');}
   if(ff && type != "view"){ff.setDisplayType('hidden');} 

 //  {ff.setDisplayType('normal');  }
   //if(fg && type != "view"){fg.setDisplayType('hidden');}
   //if(fi && type != "view"){fg.setDisplayType('normal');}
 }

    if( fm && type != "view" )
 {fm.setDisplayType('hidden');  }

 if((SOID == "To Be Generated" && fh) || ( fh && type != "edit"  ) )
 {fh.setDisplayType('hidden');  }
  }
}  

