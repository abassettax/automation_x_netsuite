function weborderconfirm()
{
var author =3354;
var recordID = nlapiGetRecordId(); 


var src = nlapiLookupField('salesorder', recordID , 'source', true );


 nlapiLogExecution('debug','recordid', recordID );

if(src == "Web (Automation-X: Oil and Gas Well Automation Equipment)" || src == 'Customer Center') 
{

var recordType = nlapiGetRecordType();
var salesrep = nlapiLookupField('salesorder', recordID , 'salesrep');


var salesrep1 = nlapiGetLineItemValue('salesteam', 'employee', 1);
var salesrep2 = nlapiGetLineItemValue('salesteam', 'employee', 2);
var salesrep3 = nlapiGetLineItemValue('salesteam', 'employee', 3);
var salesrep4 = nlapiGetLineItemValue('salesteam', 'employee', 4);


var SO = nlapiLookupField('salesorder', recordID , 'tranid');
var AM = nlapiLookupField('salesorder', recordID , 'amount');
var cust = nlapiLookupField('salesorder', recordID , 'entity');
var custname = nlapiLookupField('salesorder', recordID , 'entity', true);
var sub = "Your Automation-X order Number " + SO + " has been received."
var subrep = "Automation-X Customer " + custname + " has placed an online order.  Number " + SO + " has been received"
var rec = nlapiLookupField('salesorder', recordID , 'email');
alert(recordType + "  " + recordID + "  " + cust);

 
emailMessage = nlapiMergeEmail(24, recordType, recordID, 'customer',cust);

emailMessageRep = custname + " placed an order online (order# "  + SO + " " + AM + ").  Please verify and process the order." 


 

//if(rec != "")
//{
//nlapiSendEmail(author, rec, sub, emailMessage );
//}


if( salesrep1  != null)
{
var salesrepemail1  =   nlapiLookupField('employee', salesrep1, 'email');     
nlapiSendEmail(salesrep1, salesrepemail1 , subrep, emailMessageRep );
}

if(salesrep2 != null)
{
var salesrepemail2  =   nlapiLookupField('employee', salesrep2, 'email');
nlapiSendEmail(salesrep2, salesrepemail2, subrep, emailMessageRep  );
}

if(salesrep3 != null)
{
var salesrepemail3  =  nlapiLookupField('employee', salesrep3, 'email');
nlapiSendEmail(salesrep3, salesrepemail3 , subrep, emailMessageRep );
}

if(salesrep4 != null)
{
var salesrepemail3  =  nlapiLookupField('employee', salesrep4, 'email');
nlapiSendEmail(salesrep4, salesrepemail4 , subrep, emailMessageRep );
}


return(true);
}
return(true);

}




