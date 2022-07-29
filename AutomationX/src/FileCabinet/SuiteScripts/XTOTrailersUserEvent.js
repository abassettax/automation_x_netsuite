function xtoBeforeSubmit(type, form)
{
nlapiSetFieldValue('customform', 294);
  var cust = nlapiGetFieldValue('entity');
 nlapiSetFieldValue('location', nlapiLookupField('customer', cust, 'custentity180')); 
  nlapiSetFieldValue('class', nlapiLookupField('customer', cust, 'custentity149'));
  ////////set avatax
  var lineCount = nlapiGetLineItemCount('item');
for (var i =1;  i <= lineCount; i++) 
	{
      nlapiSetLineItemValue( 'item' , 'taxcode' , i,  9162); //'AVATAX')
    }
}

function XTOTrailerUserEvent(type, form)
{
 if (type == 'create') {nlapiLogExecution('debug','login', nlapiGetContext().getEmail() );}
 //{
  //      var pass_value = "abcd";  //<html><body><script type='text/javascript'>     var nPR = document.getElementById('cmmnctntab_pane_hd'); if(nPR){nPR.style.display = 'none'; }      </script></body></html>
     //   nlapiSetFieldValue("custbody_seneca_hide_so_fields", pass_value); //custentity25 is the id of Inline HTML field we created
    //}
  

   if (nlapiGetContext().getExecutionContext() == 'userinterface') {
        form.setScript('customscript1391');//<< SET THIS TO YOUR SCRIPT ID
    }
  
 if(nlapiGetRole() == 1127) // Seneca
   {

     form.removeButton('makecopy');
     var cbutton = form.getButton('makecopy');    if(cbutton){cbutton.setVisible(false);}
      var email = form.getButton('email');    if(email){email.setVisible(false);}
      var scan = form.getButton('custpage_btnscandocument');    if(scan){scan.setVisible(false);}
      var newfile = form.getButton('newrecrecmachcustrecord157');    if(newfile){newfile.setVisible(false);}  //
     var POR = form.getButton('newrecrecmachcustrecord221'); if(POR){POR.setVisible(false);}
      var PK =   form.getField('custbody7');   if(PK){PK.setDisplayType('hidden');}  //
      var EC =   form.getField('excludecommission');   if(EC){EC.setDisplayType('hidden');}  //excludecommission
     var CC =   form.getField('couponcode');   if(CC){CC.setDisplayType('hidden');} 
     var Promo =   form.getField('promocode');   if(Promo){Promo.setDisplayType('hidden');} 
     var DItem =   form.getField('discountitem');   if(DItem){DItem.setDisplayType('hidden');} 
    // var docusign = form.getSubList('custpage_docusign_tab_pane_ml'); docusign.setDisplayType('hidden');
    var ttsn =   form.getSubList('item').getField('custcol48');   if(ttsn){ttsn.setDisplayType('hidden');}
    var ttws =   form.getSubList('item').getField('custcol49');   if(ttws){ttws.setDisplayType('hidden');}
   }
  else
    {
 var fa =   form.getSubList('item').getField('amount'); 
var fb =   form.getSubList('item').getField('taxrate1');  
var fc =   form.getSubList('item').getField('taxcode');
var fd =  form.getSubList('item').getField('location');
   if(fa){fa.setDisplayType('hidden');}
   if(fb){fb.setDisplayType('hidden');}
   if(fc){fc.setDisplayType('hidden');}
   if(fd){fd.setDisplayType('hidden');} 
 // var login = nlapiGetLogin();
      var login = "Login Placeholder"
//form.getTab('paymentevent').setDisplayType('hidden');
//billingtab_pane_hd
}
}

function AfterSubmitXTO()  // redirect User to thank you for order page.
{
 

  var custparamso ='SO12345';
   nlapiLogExecution('debug','custparamso', nlapiGetFieldValue("tranid")); 
  nlapiSetRedirectURL('SUITELET', 'customscript1388', 'customdeploy1', null, custparamso );
  
  
}