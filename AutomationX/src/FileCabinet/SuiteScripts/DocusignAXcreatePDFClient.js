function CreatePDFandSendClient()

{
  var transid = nlapiGetRecordId();
 localStorage.TransactionID = transid;
  
  var tranNum = nlapiGetFieldValue('transactionnumber');

nlapiRequestURL(nlapiResolveURL('SUITELET','customscript777','customdeploy1') + '&id=' + nlapiGetRecordId()+ '&rectype=' + nlapiGetRecordType() + '&tranNum=' + tranNum);

try{ if (!!window) { var origScriptIdForLogging = window.NLScriptIdForLogging; var origDeploymentIdForLogging = window.NLDeploymentIdForLogging; window.NLScriptIdForLogging = 'customscript776'; window.NLDeploymentIdForLogging = 'CUSTOMDEPLOY1'; }docusign_process('automate', '/core/media/media.nl?id=7339309&c=422523&h=c6a46d18863bbe6ee4f1', 'F', '7339309')}finally{ if (!!window) { window.NLScriptIdForLogging = origScriptIdForLogging; window.NLDeploymentIdForLogging = origDeploymentIdForLogging; }}; 
 return false;
         }
  

///core/media/media.nl?id=4720170&c=422523&h=e1c70c3871050ba85492  '/core/media/media.nl?id=7339309&c=422523&h=c6a46d18863bbe6ee4f1', 'F', '4723255')


function axdocusignFF()

{
  
nlapiDetachRecord('file', 5068052, 'salesorder', 1510529);
//retrieve the record id passed to the Suitelet
var recId = docusignContext.recordId;
  log.debug('record ID: ', recId);

var customerid  = nlapiLookupField('transaction', recId , 'entity');
 var filename = nlapiLookupField('transaction', recId , 'transactionnumber');
var recordtype = nlapiLookupField('transaction', recId , 'baserecordtype');

////////create docusign

 var custcont= nlapiLookupField('transaction', recId, 'custbody91'); 
 var conName  = nlapiLookupField('contact', custcont, 'entityid'); 
 var conEmail =   nlapiLookupField('contact', custcont , 'email'); 


  
if(conEmail =="" || conName ==""  )
  {
var columnsDS  = new Array();
columnsDS[0] =   new nlobjSearchColumn("contact",null,null);
columnsDS[1] =   new nlobjSearchColumn("email","contactPrimary",null);


var customerSearch = nlapiSearchRecord("customer",null,
[
   ["internalidnumber","equalto", customerid   ], 
   "AND", 
   ["isinactive","is","F"]
], 
columnsDS  
);
 



if(customerSearch )
  {
conName  = nlapiLookupField('contact',  customerSearch[0].getValue(columnsDS[0]), 'entityid');  
conEmail = customerSearch[0].getValue(columnsDS[1]);
 }
  }

var recipients2 = [
 { id: 1
, order: 1
 , name: conName  
 , email: conEmail
 }, 
];
  
  var searches = [
{ keyword: 'Docusign.pdf'
, type: 'phrase' },
{ keyword: 'Docusign.pdf'
, type: 'broad' }
];
  
  var files2 = [
{ type: 'template'
, id: '072bef71-c26e-4b17-a661-6c35756a46e6',
}];
var filesrr ='Sales_Order SO162211 Docusign.pdf'
var recipients = docusignGetRecipients(docusignContext);
//var files = docusignGetFiles(docusignContext, searches);
return docusignPopulateEnvelope(docusignContext, recipients2, files);
  
}