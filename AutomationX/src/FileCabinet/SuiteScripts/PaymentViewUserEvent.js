function CreateJePaymentUserEvent(type, form)
{
var createJEButton = form.getField('custbody_customer_payment_buttons'); 
  if(createJEButton){createJEButton.setDisplayType('hidden');}
  
nlapiLogExecution('Debug', '2', 2);

var JEAmount = nlapiGetFieldValue( 'custbody_journal_entry_amount');
nlapiLogExecution('Debug', 'JEAmount', JEAmount);
//TODO this just resets the fields on the payment, doesn't actually create the JE. should probably leave the fields as is
if(JEAmount!=0)
   {
 var paymentid =nlapiGetRecordId();
     nlapiLogExecution('Debug', 'paymentid', paymentid);
nlapiSubmitField('customerpayment', paymentid, 'custbody_journal_entry_amount', null);
nlapiSetRedirectURL('RECORD','customerpayment', paymentid, true);

   }

}