function CreateJe()
{
   document.getElementById("btn_multibutton_submitter").click(); 
  var PaymentAccount =  nlapiGetFieldValue('aracct');
  var headerMemo =  nlapiGetFieldValue('memo');
  var payID = nlapiGetFieldValue('tranid'); 
  var date = nlapiGetFieldValue('trandate');
  var cust = nlapiGetFieldValue('customer');  
  var custtext =nlapiGetFieldText('customer');
  var JELineMemo = nlapiGetFieldValue('custbody_journal_entry_memo');
  var JEamount =nlapiGetFieldValue('custbody_journal_entry_amount');
  //TODO: work in case for negative JE amount
  if(JEamount != 0)
    {
  var overunder ="";
      if(JEamount>0){overunder= 'Over Payment'}else{overunder= ' Under Payment ' }
  var JEheaderMemo = 'Customer Payment Adjustment Created From Payment: ' +  payID   + ' Customer: ' + custtext;
  var newlinememo = JELineMemo + ' ' + overunder;
var rec = nlapiCreateRecord('journalentry');
  
 rec.setFieldValue('memo', JEheaderMemo);
 rec.setFieldValue('approved', 'T');

  // set adjustment line
 rec.selectNewLineItem('line');
 rec.setCurrentLineItemValue("line", 'account', 243);
 rec.setCurrentLineItemValue("line", 'memo', newlinememo);
 rec.setCurrentLineItemValue("line", 'entity', cust);
 if(JEamount < 0 ){   rec.setCurrentLineItemValue("line", 'debit', Math.abs(JEamount));   }else{  rec.setCurrentLineItemValue("line", 'credit',  Math.abs(JEamount)); }
 rec.commitLineItem('line');
 
  //set ar account line
  rec.selectNewLineItem('line');
 rec.setCurrentLineItemValue("line", 'account', PaymentAccount);
  rec.setCurrentLineItemValue("line", 'entity', cust);
 rec.setCurrentLineItemValue("line", 'memo', newlinememo);
  if(JEamount > 0 ){ rec.setCurrentLineItemValue("line", 'debit',  Math.abs(JEamount));   }else{  rec.setCurrentLineItemValue("line", 'credit', Math.abs(JEamount)); }
 rec.commitLineItem('line');
  
  var newJE = nlapiSubmitRecord(rec);

  //TODO
 
  var JEURL = 'https://system.na3.netsuite.com/app/accounting/transactions/journal.nl?id='+newJE +'&whence=';
window.open(JEURL, '_blank');
   var newJENumber = nlapiLookupField('journalentry', newJE, 'tranid');
  var newheadermemo = headerMemo +=  ' ' + newJENumber;
  nlapiSetFieldValue('memo', newheadermemo );
  nlapiSetFieldValue('ignorecsc', "F" );
    }
}